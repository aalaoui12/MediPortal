'use client';

import { IDKitWidget } from "@worldcoin/idkit";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

import { DynamicWidget } from "@dynamic-labs/sdk-react-core";
import { Pimlico } from "./Pimlico";

export default function MediPortal() {
    const [smartAccount, setSmartAccount] = useState(null);

    const account = useAccount();

    const [nullHash, setNullHash] = useState();
    const [proof, setProof] = useState();
    const [verified, setVerified] = useState(false);
    
    function onSuccess(response: any) {
        console.log(response);
        console.log("Successfully verified.");
        setNullHash(response.nullifier_hash);
        setProof(response.proof);
        setVerified(true);
    }

    useEffect(() => {
        if (smartAccount) console.log("Smart Account: ", smartAccount);
      }, [smartAccount]);

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <div className="App flex flex-col items-center">
                <h1 className="text-3xl">
                    MediPortal
                </h1>
                <div className='flex flex-col space-y-2 mt-8'>
                    <div>
                        <DynamicWidget />
                        <Pimlico
                        smartAccount={smartAccount}
                        setSmartAccount={setSmartAccount}
                        />
                    </div>
                    <button className="text-white bg-black rounded py-2 px-4">Sign in with wallet</button>
                    <IDKitWidget
                        signal={account.address}
                        action="mint_meditoken"
                        onSuccess={onSuccess}
                        app_id="app_staging_6987c97320a0eedbcbf943ce08898fd3"
                    >
                        {({ open }) => <button className="text-white bg-black rounded py-2 px-4" onClick={open}>Verify with World ID</button>}
                    </IDKitWidget>
                </div>
            </div>
        </main>
    )
}