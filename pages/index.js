import { ethers } from "ethers";
import { useEffect, useState } from "react";
import axios from "axios";
import Web3Modal from "web3modal";

import { nftAddress, nftMarketAddress } from "../config";

import NFT from "../artifacts/contracts/NFT.sol/NFT.json";
import KBMarket from "../artifacts/contracts/KBMarket.sol/KBMarket.json";

export default function Home() {
    const [nfts, setNfts] = useState([]);
    const [loadingState, setLoadingState] = useState("not-loaded");

    useEffect(() => {
        loadNFTs();
    }, []);

    const loadNFTs = async () => {
        const provider = new ethers.providers.JsonRpcProvider(); // very basic generic provider
        const tokenContract = new ethers.Contract(
            nftAddress,
            NFT.abi,
            provider
        );
        const marketContract = new ethers.Contract(
            nftMarketAddress,
            KBMarket.abi,
            provider
        );
        const data = await marketContract.fetchtMarketToken(); // Fetching all market NFT's

        const items = await Promise.all(
            data.map(async (item) => {
                const tokenURI = tokenContract.tokenURI(item.tokenId);
                // tokenURI -> https://test-api.com/token/1
                const meta = await axios.get(tokenURI); // Token's name, description, image/video -> jeigula ipfs e upload kora hoise
                const price = ethers.utils.formatUnits(
                    item.price.toString(),
                    "ethers"
                );

                return {
                    price,
                    tokenId: item.tokenId.toNumber(),
                    seller: item.seller,
                    owner: item.owner,
                    image: meta.data.image,
                    name: meta.data.name,
                    description: meta.data.description,
                };
            })
        );

        setNfts(items);
        setLoadingState("loaded");
    };

    const buyNFT = async (nft) => {
        // Connecting to metamask
        const web3modal = new Web3Modal();
        const connection = await web3modal.connect();
        // As we need to pay by this provider we cannot use the basic JSONRPCprovider
        const provider = new ethers.providers.Web3Provider(connection);

        // We will be paying by this signer
        const signer = provider.getSigner();
        const Contract = new ethers.Contract(
            nftMarketAddress,
            KBMarket.abi,
            signer
        );

        const price = ethers.utils.parseUnits(nft.price.toString(), "ether");
        const transaction = Contract.createMarketSale(nftAddress, nft.tokenId, {
            value: price,
        });

        await transaction.wait();
        loadNFTs();
    };

    if (loadingState === "loaded" && !nfts.length)
        return <h1 className="px-20 py-7 text-4x1">No NFts in marketplace</h1>;

    return (
        <div className="flex justify-center">
            <div className="px-4" style={{ maxWidth: "1600px" }}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
                    {nfts.map((nft, i) => (
                        <div
                            key={i}
                            className="border shadow rounded-x1 overflow-hidden"
                        >
                            <img src={nft.image} />
                            <div className="p-4">
                                <p
                                    style={{ height: "64px" }}
                                    className="text-3x1 font-semibold"
                                >
                                    {nft.name}
                                </p>
                                <div
                                    style={{
                                        height: "72px",
                                        overflow: "hidden",
                                    }}
                                >
                                    <p className="text-gray-400">
                                        {nft.description}
                                    </p>
                                </div>
                            </div>
                            <div className="p-4 bg-black">
                                <p className="text-3x-1 mb-4 font-bold text-white">
                                    {nft.price} ETH
                                </p>
                                <button
                                    className="w-full bg-purple-500 text-white font-bold py-3 px-12 rounded"
                                    onClick={() => buyNFT(nft)}
                                >
                                    Buy
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
