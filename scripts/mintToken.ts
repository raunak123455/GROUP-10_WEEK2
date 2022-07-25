import { Contract, ethers } from "ethers";
import "dotenv/config";
import * as tokenJson from "../artifacts/contracts/Token.sol/MyToken.json";
// eslint-disable-next-line node/no-missing-import
import { MyToken } from "../typechain";

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
  console.log(`Signer address is : ${signer.address}`);

  const tokenAddress = process.argv[2];
  const mintToAddress = process.argv[3];
  //const proposalIndex = process.argv[3];
  console.log(`Contract address is : ${tokenAddress}`);

  const tokenContract: MyToken = new Contract(
    tokenAddress,
    tokenJson.abi,
    signer
  ) as MyToken;

  const tx = await tokenContract.mint(mintToAddress, "10000000000000000000");
  console.log("Awaiting confirmations");
  await tx.wait();
  console.log(`Mint operation completed. Hash: ${tx.hash}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
