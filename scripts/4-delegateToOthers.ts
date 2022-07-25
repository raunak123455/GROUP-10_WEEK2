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

  if (args.length < 2)
    throw new Error(
      "Please provide the contract address ass well as the delegate to address"
    );

  const tokenAddress = args[0];
  const delegateTo = args[1];
  if (tokenAddress.length === 0)
    throw new Error("Please provide the token addresses");
  if (delegateTo.length === 0)
    throw new Error("Please provide the delegate To addresses");

  const tokenContract: MyToken = new ethers.Contract(
    tokenAddress,
    tokenJson.abi,
    signer
  ) as MyToken;

  const tokenBalance = Number(
    ethers.utils.formatEther(await tokenContract.balanceOf(wallet.address))
  );

  console.log(`Token balance ${tokenBalance}`);

  if (tokenBalance < 0.01)
    throw new Error("You dont have enough tokens, please mint some.");

  const tx = await tokenContract.delegate(delegateTo);

  await tx.wait();

  console.log(`Delegating operations completed . Hash: ${tx.hash}`);



  const newBalance = Number(
    ethers.utils.formatEther(await tokenContract.balanceOf(wallet.address))
  );

  console.log(`Token balance ${newBalance}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
