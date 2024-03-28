'use client';

import { ethers } from "ethers";
import { decodeAbiParameters, encodeFunctionData, parseAbiParameters } from "viem";
import { baseSepolia } from "viem/chains";

import ABI from '../lib/abi/MediPortal.json';
import { useSmartAccount } from "../context/SmartAccountProvider";

export async function postMedicalData(root: string, nullHash: string, proof: string) {
    const { smartAccountAddress, smartAccountClient, eoa } = useSmartAccount();

    const transactionHash = await smartAccountClient!.sendTransaction({
        account: smartAccountClient!.account!,
        chain: baseSepolia,
        to: "0xA196fE98091EbA3f4F893e8AEF984a50e574e45D",
        data: encodeFunctionData({
          abi: ABI,
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

    return transactionHash;
}