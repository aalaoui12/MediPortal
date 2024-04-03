'use client';

import { ethers } from "ethers";
import { decodeAbiParameters, encodeFunctionData, parseAbiParameters, zeroAddress } from "viem";
import { baseSepolia } from "viem/chains";

import contractArtifact from '../lib/abi/MediPortal.json';
import { SmartAccountClient } from "permissionless";
import { ENTRYPOINT_ADDRESS_V06_TYPE } from "permissionless/_types/types";
import { SendTransactionErrorType } from "viem/zksync";

const abi = contractArtifact.abi;
const contractAddress = "0x81666188d2aA1a45E643be3bf8eBb28b386AeC2D";

export async function postMedicalData(smartAccountClient: SmartAccountClient<ENTRYPOINT_ADDRESS_V06_TYPE>, smartAccountAddress: string, root: string, nullHash: string, proof: string, cid: string) {
    try {
        /*
        const transactionHash = await smartAccountClient!.sendTransaction({
            account: smartAccountClient.account!,
            chain: baseSepolia,
            to: contractAddress,
            data: encodeFunctionData({
              abi: abi,
              functionName: "verifyAndExecute",
              args: [
                        smartAccountAddress, 
                        BigInt(root), 
                        BigInt(nullHash),
                        decodeAbiParameters(
                            parseAbiParameters('uint256[8]'),
                            proof as `0x${string}`
                        )[0],
                        "QmZnSTYfGQYDXK4n4SYmSJDUuzchfmu4GSfRpDwTtTFJBo"],
            }),
        });
        */

        const transactionHash = await smartAccountClient!.sendTransaction({
            account: smartAccountClient.account!,
            chain: baseSepolia,
            to: contractAddress,
            data: encodeFunctionData({
              abi: abi,
              functionName: "mintMediToken",
              args: [
                        BigInt(nullHash),
                        cid],
            }),
        });

        return transactionHash;
    } catch (error) {
        const txnError = error as SendTransactionErrorType;

        console.log(txnError.cause);
    }
}