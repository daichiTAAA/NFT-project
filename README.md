# This is repository of New type NFT MRAKET.

①After clone this repository, first of all run next command to install dependencies.
npm install

②To run this program, you need next files.
auth.js file that contains

```shell

const auth = {
NEXT_NFT_PINATA_KEY: "",
NEXT_NFT_PINATA_SECRET:"",
NEXT_NFT_PINATA_JWT:"",
ALCHEMY_PROJECT_ID: "",
};

export default auth;

```

You have to get account of pinata and alchemy.

p-key.txt file that contains

```shell
//your metamask account private key
```

alchemy-project-id.txt ile that contains

```shell
//your alchemy project id
```

③To compile and deploy your contract, run next command.
At the first, to run hardhat node, run next command and import an account on metamask by private key that is displayed on your terminal.

```shell
npx hardhat node
```

In the next, for localhost:

```shell
npx hardhat run scripts/deploy.js --network localhost
```

For polygon mumbai network:

```shell
npx hardhat run scripts/deploy.js --network mumbai
```

And then, save contract addresses in config.js

```shell
  export const nftMarketaddress = ""
  export const nftaddress = ""
```

④To run Next.js code, run next command.
npm run dev

# To run Hardhat Project

how to run by hardhat

```shell
npx hardhat accounts
npx hardhat compile
npx hardhat clean
npx hardhat test
npx hardhat node
node scripts/deploy.js
npx hardhat help
```

# References

https://www.udemy.com/course/build-an-nft-marketplace-from-scratch-blockchain-dapp/
https://docs.alchemy.com/alchemy/tutorials/nft-minter#create-your-pinata-api-key
https://docs.alchemy.com/alchemy/tutorials/nft-minter
https://docs.alchemy.com/alchemy/tutorials/how-to-create-an-nft/how-to-mint-a-nft
https://docs.pinata.cloud/pinata-node-sdk#pinjsontoipfs
https://github.com/ipfs/js-ipfs/tree/master/packages/ipfs-core#readme
https://dev.to/edge-and-node/building-scalable-full-stack-apps-on-ethereum-with-polygon-2cfb
