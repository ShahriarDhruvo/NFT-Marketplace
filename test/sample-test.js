const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("KBMarket", function () {
    it("Should return the market... SED", async function () {
        const Market = await ethers.getContractFactory("KBMarket");
        const market = await Market.deploy();
        await market.deployed();
        const marketAddress = market.address;

        const NFT = await ethers.getContractFactory("NFT");
        const nft = await NFT.deploy(marketAddress);
        await nft.deployed();
        const nftContractAddress = nft.address;

        let listingPrice = await market.getListingPrice();
        listingPrice = listingPrice.toString();

        // This is the dummy price of these 2 test items.
        // By doing this I am setting the price of the nft-token to 100eth
        const auctionPrice = ethers.utils.parseUnits("100", "ether");

        // test for minting and create items in marketplace
        // created/mint the nft
        await nft.mintToken("https-t1");
        await nft.mintToken("https-t2");

        // {
        //   value: listingPrice,
        // }
        //  is the value of msg.vendor that is checking in the function's required.
        await market.createMarketItem(nftContractAddress, 1, auctionPrice, {
            value: listingPrice,
        });
        await market.createMarketItem(nftContractAddress, 2, auctionPrice, {
            value: listingPrice,
        });

        // test for different address from different account
        const [_, buyer] = await ethers.getSigners();

		//////////////////////////////////////////
        // let balanceInfo = ethers.utils.formatEther(
        //     await market.showBalance(buyer.address)
        // );
		let balanceInfo = await market.showBalance(buyer.address, 1)
		showBalanceInfo(balanceInfo, nftContractAddress);
		//////////////////////////////////////////

        await market.connect(buyer).createMarketSale(nftContractAddress, 2, {
            value: auctionPrice,
        });

		//////////////////////////////////////////
        balanceInfo = await market.showBalance(buyer.address, 1)
		showBalanceInfo(balanceInfo, nftContractAddress);
		//////////////////////////////////////////

        // let items = await market.fetchtMarketToken();

        // items = await Promise.all(
        //     items.map(async (item) => ({
        //         tokenId: item.tokenId.toString(),
        //         price: item.price.toString(),
        //         seller: item.seller,
        //         owner: item.owner,
        //         tokenURI: await nft.tokenURI(item.tokenId),
        //     }))
        // );

        // console.log(items);
    });
});


function showBalanceInfo(balanceInfo, nftContractAddress) {
	info = {
		buyerBalance: ethers.utils.formatEther(balanceInfo.buyerBalance),
		sellerBalance: ethers.utils.formatEther(balanceInfo.sellerBalance),
		MarketBalance: ethers.utils.formatEther(balanceInfo.marketBalance),
		MsgBalance: ethers.utils.formatEther(balanceInfo.msgBalance),
		GasFee: ethers.utils.formatEther(balanceInfo.gasFee),
		GasLeft: ethers.utils.formatEther(balanceInfo.gasLeft),
		MarketAddress: balanceInfo.marketAddress.toString(),
		SellerAddress: balanceInfo.sellerAddress.toString(),
		BuyerAddress: balanceInfo.buyerAddress.toString()
	};
	
	console.log("\nInfo...");
	console.log(nftContractAddress)
	console.log(info);
}