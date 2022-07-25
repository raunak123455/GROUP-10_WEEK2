import { ethers } from "ethers";
import "dotenv/config";

import * as ballotJson from "../artifacts/contracts/CustomBallot.sol/CustomBallot.json";
import { CustomBallot } from "../typechain";

const EXPOSED_KEY = "8da4ef21b864d2cc526dbdb2a120bd2874c36c9d0a1fb7f8c63d7f7a8b41de8f";

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

    if (args.length < 2) throw new Error("Please provide the ballot addresses");

    const ballotAddress = args[1];


    const ballotContract: CustomBallot = new ethers.Contract(
        ballotAddress,
        ballotJson.abi,
        signer
    ) as CustomBallot;

    try {
        let proposal;
        let proposalName: string;
        let voteCount: string;
        let i = 0;
        while (true) {
            proposal = await ballotContract.proposals(i);
            proposalName = ethers.utils.parseBytes32String(proposal.name);
            voteCount = proposal.voteCount.toString();
            console.log(
                `Proposal ${i + 1}: ${proposalName}, vote count: ${voteCount}`
            );
            i++;
        }
    } catch (error) { }

    const winnerName = await ballotContract.winnerName();
    console.log(
        `Winning proposal is: ${ethers.utils.parseBytes32String(winnerName)}`
    );
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
