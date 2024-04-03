import { config as dotEnvConfig } from "dotenv";
import { expect } from "chai";
import hre from "hardhat";

dotEnvConfig();

describe("MediPortal", function () {
    it("Main test case", async function () {
        console.log("starting off");
        const nftContractFactory = await hre.ethers.getContractFactory('MediPortal');
        console.log("reached here");
        const nftContract = await nftContractFactory.deploy(
            process.env.NEXT_PUBLIC_BASE_WORLD_ID_ROUTER!,
            process.env.NEXT_PUBLIC_WORLD_ID_APP_ID!,
            'mint_meditoken'
        );
        console.log("Contracted deployed to ", await nftContract.getAddress());

        const nullHash = 30;
        const cid = "20";
        await expect(nftContract.mintMediToken(nullHash, cid)).to.emit(nftContract, "NFTMinted");

        console.log("Finished.");
    })
})

/*
const runTest = async () => {
    try {
        await testContract().then(() => {
            console.log("success");
        });
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

runTest();
*/