import { ethers } from "ethers";
import "dotenv/config";
import * as customBallotJson from "../artifacts/contracts/CustomBallot.sol/CustomBallot.json";

// This key is already public on Herong's Tutorial Examples - v1.03, by Dr. Herong Yang
// Do never expose your keys like this
const EXPOSED_KEY =
  "8da4ef21b864d2cc526dbdb2a120bd2874c36c9d0a1fb7f8c63d7f7a8b41de8f";

function convertStringArrayToBytes32(array: string[]) {
  const bytes32Array = [];
  for (let index = 0; index < array.length; index++) {
    bytes32Array.push(ethers.utils.formatBytes32String(array[index]));
  }
  return bytes32Array;
}

function setupProvider() {
  const infuraOptions = process.env.INFURA_API_KEY
    ? process.env.INFURA_API_SECRET
      ? {
          projectId: process.env.INFURA_API_KEY,
          projectSecret: process.env.INFURA_API_SECRET,
        }
      : process.env.INFURA_API_KEY
    : "";
  const options = {
    alchemy: process.env.ALCHEMY_API_KEY,
    infura: infuraOptions,
  };
  const provider = ethers.providers.getDefaultProvider("rinkeby", options);
  return provider;
}

async function main() {
  const wallet =
    process.env.MNEMONIC && process.env.MNEMONIC.length > 0
      ? ethers.Wallet.fromMnemonic(process.env.MNEMONIC)
      : new ethers.Wallet(process.env.PRIVATE_KEY ?? EXPOSED_KEY);
  console.log(`Using address ${wallet.address}`);
  const provider = setupProvider();
  const signer = wallet.connect(provider);
  const balanceBN = await signer.getBalance();
  const balance = Number(ethers.utils.formatEther(balanceBN));
  console.log(`Wallet balance ${balance}`);
  if (balance < 0.01) {
    throw new Error("Not enough ether");
  }

  console.log("Proposals: ");
  let args = process.argv.slice(2);
  if (args.length < 3) throw new Error("Not enough proposals provided or no token address provided");
  const tokenAddress = args[args.length-1];
  console.log(tokenAddress);
  args.splice(args.length-1,1);
  const proposals = args;
  console.log(proposals);
  proposals.forEach((element, index) => {
    console.log(`Proposal N. ${index + 1}: ${element}`);
  });




  console.log("Deploying customBallot contract");
  const customBallotFactory = new ethers.ContractFactory(
    customBallotJson.abi,
    customBallotJson.bytecode,
    signer
  );
  const customBallotContract = await customBallotFactory.deploy(
    convertStringArrayToBytes32(proposals),
    tokenAddress
    );
  console.log("Awaiting confirmations");
  await customBallotContract.deployed();
  console.log("Completed");
  console.log(`Contract deployed at ${customBallotContract.address}`);
  
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

////////////GROUP10