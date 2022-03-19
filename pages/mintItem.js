import { ethers } from "ethers";
import { useState } from "react";
import Web3Modal from "web3modal";
import Image from "next/image";
import { useRouter } from "next/router";
import * as IPFS from "ipfs-core";

import { nftaddress, nftMarketaddress } from "../config";

import NFT from "../artifacts/contracts/NFT.sol/NFT.json";
import KBMarket from "../artifacts/contracts/KBMarket.sol/KBMarket.json";
import { pinJSONToIPFS } from "../utils/pinata";

// in this component we set the ipfs up to host our nft data of
// file storage

export default function MintItem() {
  const [fileUrl, setFileUrl] = useState("");
  const [formInput, updateFormInput] = useState({
    price: "",
    name: "",
    description: "",
  });

  const router = useRouter();

  // set up a function to tireoff when we update files in our form - we can add our
  // NFT images - IPFS

  async function pickUpImage() {
    let fileHandle;

    // open file picker, destructure the one element returned array
    [fileHandle] = await window.showOpenFilePicker();
    try {
      const fileData = await fileHandle.getFile();
      const fileDataStream = await fileData.stream();
      const ipfs = await IPFS.create();
      const { cid } = await ipfs.add(fileDataStream);
      // const hash = cid._baseCache.get("z");
      const ipfsImageUrl = `https://gateway.pinata.cloud/ipfs/${cid}`;
      // console.log(ipfsImageUrl);
      setFileUrl(ipfsImageUrl);
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  }

  // we mint a NFT and run a function that creates sale and passes in the url

  async function createMarket() {
    const { name, description, price } = formInput;
    if (!name || !description || !price || !fileUrl) return;

    // upload to IPFS

    const data = JSON.stringify({
      name,
      description,
      image: fileUrl,
    });

    try {
      const pinataResponse = await pinJSONToIPFS(data);
      if (!pinataResponse.success) {
        return {
          success: false,
          status: "😢 Something went wrong while uploading your tokenURI.",
        };
      }
      const url = pinataResponse.pinataUrl;

      // run a function that creates sale and passes in the url
      createSale(url);
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  }

  async function createSale(url) {
    // create the items and list them on the marketplace
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    // we want to create the token
    let contract = new ethers.Contract(nftaddress, NFT.abi, signer);
    let transaction = await contract.mintToken(url);
    let tx = await transaction.wait();
    let event = tx.events[0];
    let value = event.args[2];
    let tokenId = value.toNumber();
    const price = ethers.utils.parseUnits(formInput.price, "ether");

    // list the item for sale on the marketplace
    contract = new ethers.Contract(nftMarketaddress, KBMarket.abi, signer);
    let listingPrice = await contract.getListingPrice();
    listingPrice = listingPrice.toString();

    transaction = await contract.makeMarketItem(nftaddress, tokenId, price, {
      value: listingPrice,
    });
    await transaction.wait();
    router.push("/");
  }

  return (
    <div className="flex justify-center">
      <div className="w-1/2 flex flex-col pb-12">
        <input
          placeholder="Asset Name"
          className="mt-8 border rounded p-4"
          onChange={(e) =>
            updateFormInput({ ...formInput, name: e.target.value })
          }
        />
        <textarea
          placeholder="Asset Description"
          className="mt-2 border rounded p-4"
          onChange={(e) =>
            updateFormInput({ ...formInput, description: e.target.value })
          }
        />
        <input
          placeholder="Asset Price in Eth"
          className="mt-2 border rounded p-4"
          onChange={(e) =>
            updateFormInput({ ...formInput, price: e.target.value })
          }
        />
        <button
          onClick={pickUpImage}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-3 mb-10"
        >
          Pick up an image!
        </button>
        {fileUrl && (
          <Image
            className="rounded mt-4"
            width="350px"
            height="350px"
            src={fileUrl}
            alt="file image"
          />
        )}
        <button
          onClick={createMarket}
          className="font-bold mt-4 bg-purple-500 hover:bg-purple-700 text-white rounded p-4 shadow-lg"
        >
          Mint NFT
        </button>
      </div>
    </div>
  );
}
