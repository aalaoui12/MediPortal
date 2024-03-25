'use client';

import { IDKitWidget } from "@worldcoin/idkit";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

import SignupForm from "../components/SignupForm";
import Profile from "../components/Profile";

export default function MediPortal() {
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
        console.log(verified);
    }, [verified]);

    return (
        <main className="flex min-h-screen flex-col">
            <header className="bg-color1 flex w-screen p-4">
                <h1 className="text-3xl text-white">
                    MediPortal
                </h1>
                <div className='flex flex-row ml-auto space-x-2'>
                    <button className="text-white rounded py-2 px-4">Sign in</button>
                    <IDKitWidget
                        signal={account.address}
                        action="mint_meditoken"
                        onSuccess={onSuccess}
                        app_id="app_staging_6987c97320a0eedbcbf943ce08898fd3"
                    >
                        {({ open }) => <button className="text-white rounded py-2 px-4" onClick={open}>Verify identity</button>}
                    </IDKitWidget>
                    {verified ? <p className="text-xs">World ID verified!</p> : ''}
                </div>
            </header>
            <div className="flex flex-row justify-center w-screen space-x-96 mt-16">
                <div>
                    <SignupForm/>
                </div>
                <div>
                    <Profile/>
                </div>
            </div>
        </main>
    )
}