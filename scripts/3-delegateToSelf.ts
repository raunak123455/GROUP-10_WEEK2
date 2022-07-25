import { ethers } from "ethers";
import "dotenv/config";
import * as tokenJson from "../artifacts/contracts/Token.sol/MyToken.json";
import * as ballotJson from "../artifacts/contracts/CustomBallot.sol/CustomBallot.json";
import { MyToken } from "../typechain";
import { CustomBallot } from "../typechain";

const EXPOSED_KEY =
  "8da4ef21b864d2cc526dbdb2a120bd2874c36c9d0a1fb7f8c63d7f7a8b41de8f";

async function main() {
  const wallet =
    process.env.MNEMONIC && process.env.MNEMONIC.length > 0
      ? ethers.Wallet.fromMnemonic(process.env.MNEMONIC)
      : new ethers.Wallet(process.env.PRIVATE_KEY ?? EXPOSED_KEY);
  console.log(`Using address ${wallet.address}`);

  const provider = ethers.providers.getDefaultProvider("rinkeby");
  const signer = wallet.connect(provider);

  let args = process.argv.slice(2);

  console.log(args);

  if (args.length < 2) throw new Error("Please provide the contract addresses");

  const tokenAddress = args[0];
  const ballotAddress = args[1];
  if (tokenAddress.length === 0)
    throw new Error("Please provide the token addresses");
  if (ballotAddress.length === 0)
    throw new Error("Please provide the ballot addresses");

  const tokenContract: MyToken = new ethers.Contract(
    tokenAddress,
    tokenJson.abi,
    signer
  ) as MyToken;

  const ballotContract: CustomBallot = new ethers.Contract(
    ballotAddress,
    ballotJson.abi,
    signer
  ) as CustomBallot;

  const tokenBalance = Number(
    ethers.utils.formatEther(await tokenContract.balanceOf(wallet.address))
  );

  console.log(`Token balance ${tokenBalance}`);

  if (tokenBalance < 0.01)
    throw new Error("You dont have enough tokens, please mint some.");

  const votingPower = await ballotContract.votingPower();

  console.log(`Voting power ${votingPower}`);

  if (votingPower.toBigInt() > 0) throw new Error("Already has voting power");

  const tx = await tokenContract.delegate(wallet.address);
  


  await tx.wait();

  console.log(`Delegating operations completed . Hash: ${tx.hash}`);

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

































