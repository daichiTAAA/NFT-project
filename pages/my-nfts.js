// we want to load the users nfts and display

import { ethers } from "ethers";
import { useEffect, useState } from "react";
import axios from "axios";
import Web3Modal from "web3modal";
import Image from "next/image";

import { nftaddress, nftMarketaddress } from "../config";

import NFT from "../artifacts/contracts/NFT.sol/NFT.json";
import KBMarket from "../artifacts/contracts/KBMarket.sol/KBMarket.json";

export default function MyAssets() {
  // array of nfts
  const [nfts, setNFts] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");

  useEffect(() => {
    loadNFTs();
  }, []);

  async function loadNFTs() {
    // what we want to load:
    // we want to get the msg.sender hook up to the signer to display the owner nfts

    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    // const provider = new ethers.providers.JsonRpcProvider();
    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider);
    const marketContract = new ethers.Contract(
      nftMarketaddress,
      KBMarket.abi,
      signer
    );
    const data = await marketContract.fetchMyNFTs();

    const items = await Promise.all(
      data.map(async (i) => {
        const tokenUri = await tokenContract.tokenURI(i.tokenId);
        // we want get the token metadata - json
        const meta = await axios.get(tokenUri);
        const dataKey = Object.keys(meta.data);
        const dataObject = JSON.parse(dataKey);
        let price = ethers.utils.formatUnits(i.price.toString(), "ether");
        let item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: dataObject.image,
          name: dataObject.name,
          description: dataObject.description,
        };
        return item;
      })
    );

    setNFts(items);
    setLoadingState("loaded");
  }

  //*******   TODO make a function to sell a NFT  ************ */

  async function sellNFT(nft) {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      nftMarketaddress,
      KBMarket.abi,
      signer
    );

    const price = ethers.utils.parseUnits(nft.price.toString(), "ether");
    const transaction = await contract.createMarketSale(
      nftaddress,
      nft.tokenId,
      {
        value: price,
      }
    );

    await transaction.wait();
    loadNFTs();
  }

  if (loadingState === "loaded" && !nfts.length)
    return (
      <h1 className="px-20 py-7 text-4x1">
        You do not own any NFTs currently :(
      </h1>
    );

  return (
    <div className="flex justify-center">
      <div className="px-4" style={{ maxWidth: "1600px" }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {nfts.map((nft, i) => (
            <div key={i} className="border shadow rounded-x1 overflow-hidden">
              <Image
                src={nft.image}
                height="300px"
                width="300px"
                alt="an image"
              />
              <div className="p-4">
                <p
                  style={{ height: "64px" }}
                  className="text-3x1 font-semibold"
                >
                  {nft.name}
                </p>
                <div style={{ height: "72px", overflow: "hidden" }}>
                  <p className="text-gray-400">{nft.description}</p>
                </div>
              </div>
              <div className="p-4 bg-black">
                <p className="text-3x-1 mb-4 font-bold text-white">
                  {nft.price} ETH
                </p>
                <button
                  className="w-full bg-purple-500 hover:bg-purple-700 text-white font-bold py-3 px-12 rounded"
                  onClick={() => sellNFT(nft)}
                >
                  Sell
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
