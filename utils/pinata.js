// require("dotenv").config();
import auth from "../auth.js";

const key = auth.NEXT_NFT_PINATA_KEY;
const secret = auth.NEXT_NFT_PINATA_SECRET;
const axios = require("axios");

// console.log("key is ", key);
// console.log("secret is ", secret);

// const body = {
//   message: "Pinatas are awesome",
// };

export const pinJSONToIPFS = async (JSONBody) => {
  const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
  //making axios POST request to Pinata ⬇️
  return axios
    .post(url, JSONBody, {
      headers: {
        pinata_api_key: key,
        pinata_secret_api_key: secret,
      },
    })
    .then(function (response) {
      // console.log(response.data.IpfsHash);
      return {
        success: true,
        pinataUrl:
          "https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash,
      };
    })
    .catch(function (error) {
      console.log(error);
      return {
        success: false,
        message: error.message,
      };
    });
};
