const hre = require("hardhat");
const fs = require("fs");

async function main() {
    const NFTMarket = await hre.ethers.getContractFactory("KBMarket");
    const nftMarket = await NFTMarket.deploy();
    await nftMarket.deployed();
    console.log("NFTMarket deployed to: ", nftMarket.address);

    const NFT = await hre.ethers.getContractFactory("NFT");
    const nft = await NFT.deploy(nftMarket.address);
    await nft.deployed();
    console.log("NFT deployed to: ", nft.address);

    let config = `export const nftMarketAddress = '${nftMarket.address}';
export const nftAddress = '${nft.address}';
  `;

    config = JSON.stringify(config);
    fs.writeFileSync("config.js", JSON.parse(config));
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
