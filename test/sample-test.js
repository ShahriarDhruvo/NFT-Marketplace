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

    const auctionPrice = ethers.utils.parseUnits("100", "ether");

    // test for minting and create items in marketplace
    await nft.mintToken("https-t1");
    await nft.mintToken("https-t2");

    await market.createMarketItem(nftContractAddress, 1, auctionPrice, {
      value: listingPrice,
    });
    await market.createMarketItem(nftContractAddress, 2, auctionPrice, {
      value: listingPrice,
    });

    // test for different address from different account
    const [_, buyerAddress] = await ethers.getSigners();

    await market.connect(buyerAddress).createMarketSale(nftContractAddress, 1, {
      value: auctionPrice,
    });

	let items = await market.fetchtMarketToken();
	console.log('rawItems: SED ---->', items, '<---- SED');

	// items = await Promise.all(items.map(async item => {
	// 	const tokenURI = await nft.tokenURI(item.tokenId);
		
	// 	return {
	// 		price: item.price.toString(),
	// 		tokenId: item.tokenId.toString(),
	// 		seller: item.seller,
	// 		owner: item.owner,
	// 		tokenURI
	// 	}
	// }));

	items = await Promise.all(items.map(async item => ({
		price: item.price.toString(),
		tokenId: item.tokenId.toString(),
		seller: item.seller,
		owner: item.owner,
		tokenURI: await nft.tokenURI(item.tokenId)
	})));

	console.log('Items: SED ---->', items, '<---- SED');
  });
});
