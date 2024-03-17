'use client';

import { IDKitWidget } from "@worldcoin/idkit";
import { useAddress } from "@thirdweb-dev/react";
import { useState } from "react";

export default function MediPortal() {
    const address = useAddress();

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

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <div className="App flex flex-col items-center">
                <h1 className="text-3xl">
                    MediPortal
                </h1>
                <div className='flex flex-col space-y-2 mt-8'>
                    <button className="text-white bg-black rounded py-2 px-4">Sign in with wallet</button>
                    <IDKitWidget
                        signal={address}
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