'use client';

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { IDKitWidget } from "@worldcoin/idkit";
import { useEffect, useState, lazy } from "react";
import { ToastContainer } from "react-toastify";
import { useAccount } from "wagmi";

import 'react-toastify/dist/ReactToastify.css';

import SignupForm from "../components/SignupForm";
import Profile from "../components/Profile";
import UserInfo from "../components/UserInfo";

export default function MediPortal() {
    const router = useRouter();
    const account = useAccount();

    const {ready, authenticated, login, logout, user} = usePrivy();

    const disableLogin = !ready || (ready && authenticated);
    const disableLogout = !ready || (ready && !authenticated);

    const [root, setRoot] = useState('');
    const [nullHash, setNullHash] = useState('');
    const [proof, setProof] = useState('');
    const [verified, setVerified] = useState(false);

    const [name, setName] = useState('');
    const [id, setID] = useState('');
    const [gender, setGender] = useState('');
    const [dob, setDOB] = useState('');

    type CheckmarkProps = {
        size: string;
    }

    // Lazy load checkmark
    const Checkmark = dynamic<CheckmarkProps>(() => import('react-checkmark').then((mod) => mod.Checkmark));

    function onSubmitForm(name: string, id: string, gender: string, dob: string) {
        setName(name);
        setID(id);
        setGender(gender);
        setDOB(dob);
    }
    
    function onSuccess(response: any) {
        console.log(response);
        console.log("Successfully verified.");
        setRoot(response.merkle_root);
        setNullHash(response.nullifier_hash);
        setProof(response.proof);
        setVerified(true);
    }

    useEffect(() => {
        console.log(verified);
    }, [verified]);

    
    useEffect(() => {
        /*
        if (ready && !authenticated) {
            router.refresh();
        }
        */
       console.log(ready);
       console.log(authenticated);
       router.refresh();
    }, [ready, authenticated, router])
    

    return (
        <main className="flex min-h-screen flex-col bg-color2/20">
            <header className="bg-color1 flex w-screen p-4">
                <h1 className="text-3xl text-white">
                    MediPortal
                </h1>
                <div className='flex flex-row items-center ml-auto space-x-2'>
                    {(ready && authenticated && user) ? <UserInfo user={user}/> : ''}
                    {(!disableLogin || !ready) ? 
                    <button disabled={disableLogin} className="bg-buttonColor hover:bg-hoverButtonColor text-white rounded-lg py-2 px-4"
                            onClick={login}>
                        Sign in
                    </button> : !disableLogout ?
                    <button disabled={disableLogout} className="bg-buttonColor hover:bg-hoverButtonColor text-white rounded-lg py-2 px-4"
                    onClick={logout}>
                        Log out
                    </button> : ''
                    }
                    <IDKitWidget
                            signal={account.address}
                            action="mint_meditoken"
                            onSuccess={onSuccess}
                            app_id="app_staging_6987c97320a0eedbcbf943ce08898fd3"
                        >
                            {({ open }) => <button className="bg-buttonColor hover:bg-hoverButtonColor text-white rounded-lg py-2 px-4" onClick={open}>{verified ? 'Reverify' : 'World ID Verify'}</button>}
                    </IDKitWidget>
                    {verified ? <Checkmark size="small"/> : ''}
                </div>
            </header>
            <ToastContainer/>
            <div className="flex flex-row justify-center w-screen space-x-48 mt-16">
                <div>
                    <SignupForm verified={verified} authenticated={authenticated} root={root} nullHash={nullHash} proof={proof} submitInfo={onSubmitForm}/>
                </div>
                <div>
                    <Profile name={name} id={id} gender={gender} dob={dob}/>
                </div>
            </div>
        </main>
    )
}