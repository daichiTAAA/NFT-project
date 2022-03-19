require("@nomiclabs/hardhat-waffle");
import { ALCHEMY_PROJECT_ID } from "./auth.js";

const fs = require("fs");
const keyData = fs.readFileSync("./p-key.txt", "utf8");

const projectId = ALCHEMY_PROJECT_ID;

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 1337, //config standard
    },
    mumbai: {
      url: `https://polygon-mumbai.g.alchemy.com/v2/${projectId}`,
      accounts: [keyData],
    },
    mainnet: {
      url: `https://polygon-mainnet.g.alchemy.com/v2/${projectId}`,
      accounts: [keyData],
    },
  },
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};
