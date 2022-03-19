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

③To run this code, run next command.
npm run dev

④To deploy contract, run next command.
For localhost:
npx hardhat run scripts/deploy.js --network localhost
For polygon mumbai network:
npx hardhat run scripts/deploy.js --network mumbai

⑤To run hardhat node, run next command and import an account on metamask by private key that is displayed on your terminal.
npx hardhat node

# To run Hardhat Project

how to run by hardhat

```shell
npx hardhat accounts
npx hardhat compile
npx hardhat clean
npx hardhat test
npx hardhat node
node scripts/sample-script.js
npx hardhat help
```
