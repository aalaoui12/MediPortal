'use client';

import { IDKitWidget } from "@worldcoin/idkit";
import { useAddress } from "@thirdweb-dev/react";
import { useState } from "react";

export default function MediPortal() {
    const address = useAddress();

    const [nullHash, setNullHash] = useState();
    const [proof, setProof] = useState();
    const [verified, setVerified] = useState();
    
    function onSuccess(response: any) {
        console.log(response);
        console.log("Successfully verified.");
        setNullHash(response.nullifier_hash);
        setProof(response.proof);
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <div className="App">
                <div className='flex flex-col space-y-2'>
                    <IDKitWidget
                        signal={address}
                        action="mint_meditoken"
                        onSuccess={onSuccess}
                        app_id="app_staging_6987c97320a0eedbcbf943ce08898fd3"
                    >
                        {({ open }) => <button onClick={open}>Verify with World ID</button>}
                    </IDKitWidget>
                </div>
            </div>
        </main>
    )
}