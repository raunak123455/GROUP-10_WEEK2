import { ethers } from "ethers";
import "dotenv/config";

import * as ballotJson from "../artifacts/contracts/CustomBallot.sol/CustomBallot.json";
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

  if (args.length < 3)
    throw new Error(
      "Please provide the contract address and proposel id and voting amount"
    );

  const ballotAddress = args[0];
  const proposalId = args[1];
  const amount = args[2];
  if (ballotAddress.length === 0)
    throw new Error("Please provide the token addresses");
  if (proposalId.length === 0)
    throw new Error("Please provide the proposal id");
  if (amount.length === 0) throw new Error("Please provide a voting amount");

  const ballotContract: CustomBallot = new ethers.Contract(
    ballotAddress,
    ballotJson.abi,
    signer
  ) as CustomBallot;


  const votingPower = await ballotContract.votingPower();

  console.log(`Voting power ${votingPower}`);

  if (votingPower.toBigInt() <= parseInt(amount))
    throw new Error("Has not enough voting power");

  const tx = await ballotContract.vote(proposalId, amount);

  await tx.wait();

  console.log(`Voting completed . Hash: ${tx.hash}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
