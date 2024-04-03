'use client';

import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import lighthouse from "@lighthouse-web3/sdk";
import kavach from "@lighthouse-web3/kavach";

import ABI from '../lib/abi/MediPortal.json';
import { useSmartAccount } from "../context/SmartAccountProvider";
import { postMedicalData } from "../lib/contractHelper";
import { createPublicClient, decodeAbiParameters, encodeFunctionData, getContract, hashMessage, http, parseAbiParameters, recoverPublicKey, toBytes, zeroAddress } from "viem";
import { baseSepolia } from "viem/chains";

interface SubmitProps {
    verified: boolean;
    authenticated: boolean;
    root: string;
    nullHash: string;
    proof: string;

    submitInfo: (name: string, id: string, gender: string, dob: string) => void;
}

export default function SignupForm({verified, authenticated, root, nullHash, proof, submitInfo}: SubmitProps) {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [id, setID] = useState('');
    const [gender, setGender] = useState('');
    const [dob, setDOB] = useState('');

    const { privyClient, smartAccountSigner, smartAccountAddress, smartAccountClient, eoa } = useSmartAccount();

    const isLoading = !smartAccountAddress || !smartAccountClient;
    const [isSubmitting, setIsSubmitting] = useState(false);
    const unfilled = (firstName.length === 0 || lastName.length === 0 || id.length === 0 || gender.length === 0 || dob.length === 0);

    function onFirstNameChange(e: any) {
        setFirstName(e.target.value);
    }

    function onLastNameChange(e: any) {
        setLastName(e.target.value);
    }

    function onIDChange(e: any) {
        setID(e.target.value);
    }

    function onGenderChange(e: any) {
        setGender(e.target.value);
    }

    function onDOBChange(e: any) {
        // console.log(e.target.value);
        setDOB(e.target.value);
    }

    async function onSubmit() {
        if (!authenticated) {
            toast("You are not signed in!", {
                position: "top-center",
                hideProgressBar: true
            });
        }
        else if (!verified) {
            toast("You need to verify your identity with World ID! Use the Worldcoin simulator for testing purposes.", {
                position: "top-center",
                hideProgressBar: true
            });
        }
        else if (unfilled) {
            toast("Make sure to fill out all fields.", {
                position: "top-center",
                hideProgressBar: true
            });
        }
        else {
            setIsSubmitting(true);
            const toastID = toast("Uploading...", {
                position: "top-center",
                hideProgressBar: true,
                autoClose: false
            });

            try {
                if (!smartAccountClient) {
                    console.log(smartAccountClient);
                    console.log("Smart account client not initialized.");
                    toast.update(toastID, {
                        render: "If you're using a browser wallet, make sure you are logged in and try again.",
                        type: "info",
                        isLoading: true,
                    });
                    return;
                }

                const medicalData = {
                    firstName: firstName,
                    lastName: lastName,
                    id: id,
                    gender: gender,
                    dob: dob,
                }
    
                const medicalJSON = JSON.stringify(medicalData);
                console.log("Privy embedded wallet address: ", privyClient?.account?.address);
                console.log("Address to check: ", smartAccountAddress);
                console.log("And smartAccountClient.account: ", smartAccountClient.account);


                console.log("OK, now uploading medical JSON data...");
    
                // const authMessage = await kavach.getAuthMessage(smartAccountAddress!);
                const authMessage = await kavach.getAuthMessage(privyClient?.account?.address!);
                console.log("Auth message: ", authMessage);
                console.log("Got auth message, signing it...");
                
                // smartAccountSigner.signMessage
                const signedMessage = await privyClient?.signMessage({
                    account: privyClient.account?.address!,
                    message: authMessage.message!,
                });
                /*
                const signedMessage = await smartAccountClient?.signMessage({
                    account: smartAccountAddress!,
                    message: authMessage.message!,
                });
                */
                console.log("Signed message: ", signedMessage);
                console.log("now getting message JWT...");

                // const { JWT, error} = await kavach.getJWT(smartAccountAddress!, signedMessage!);
                const { JWT, error} = await kavach.getJWT(privyClient?.account?.address!, signedMessage!);
                console.log(JWT, error);

                console.log("Signed auth message and got JWT, now recovering public key...");

                console.log("Recovered public key, now uploading text data...");
                const response = await lighthouse.textUploadEncrypted(medicalJSON, 
                                                                      process.env.NEXT_PUBLIC_LIGHTHOUSE_API_KEY!,
                                                                      privyClient?.account?.address!,
                                                                      JWT);
                
                console.log(response);

                console.log("Uploaded! Now minting patient NFT...");

                toast.update(toastID, {
                    render: (
                        <a href={`https://gateway.lighthouse.storage/ipfs/${response.data.Hash}`}>
                            Uploaded at this link - Now minting patient NFT...
                        </a>
                    ),
                    type: "info",
                    isLoading: true,
                });

                const publicClient = createPublicClient({
                    chain: baseSepolia,
                    transport: http("https://rpc.ankr.com/eth_sepolia"),
                })

                const txnHash = await postMedicalData(smartAccountClient!, smartAccountAddress!, root, nullHash, proof, response.data.hash);
                console.log(txnHash);

                if (txnHash === undefined) {
                    throw new Error("Transaction error: check logs.");
                }

                toast.update(toastID, {
                    render: "Waiting for your transaction to be confirmed.",
                    type: "info",
                    isLoading: true,
                });

                toast.update(toastID, {
                    render: (
                      <a href={`https://sepolia.basescan.org/tx/${txnHash}`}>
                        Successfully minted! Click here to see your transaction.
                      </a>
                    ),
                    type: "success",
                    isLoading: false,
                  });

                submitInfo(firstName.concat(" ", lastName), id, gender, dob);

            } catch (error) {
                console.log(error);
                toast.update(toastID, {
                    render: (
                      <a>
                        There was an error sending your transaction, logged in developer console.
                      </a>
                    ),
                    type: "error",
                    isLoading: false,
                    autoClose: 3000,
                  });
            }
        }
    }

    return (
        <div className="flex flex-col items-center h-screen">
            <div className="flex flex-col items-center w-full bg-color1/90 rounded-xl shadow-md pt-4 pb-2 px-8 mt-4">
                <h2 className="text-2xl text-white">Enter Patient Data</h2>
                <form className="pt-2 pb-4 flex flex-col">
                    <div className="flex space-x-4 mb-4">
                        <input value={firstName} className="bg-color2/70 text-white rounded-md border-0 focus:outline-none transition ease-in-out
                        duration-150 p-2 w-1/2 placeholder-gray-300" placeholder="First Name" type="text" onChange={onFirstNameChange}/>
                        <input value={lastName} className="bg-color2/70 text-white rounded-md border-0 focus:outline-none transition ease-in-out
                        duration-150 p-2 w-1/2 placeholder-gray-300" placeholder="Last Name" type="text" onChange={onLastNameChange}/>
                    </div>
                    <input value={id} className="bg-color2 text-white rounded-md border-0 focus:outline-none transition ease-in-out duration-150
                    p-2 placeholder-gray-300 mb-4" placeholder="ID Number" type="text" onChange={onIDChange}/>
                    <div className="flex space-x-4 mb-4">
                        <select value={gender} required className="bg-color2 text-white invalid:text-gray-300 rounded-md border-r-8 
                        border-transparent focus:outline-none p-2 w-1/2" onChange={onGenderChange}>
                            <option hidden value="" className="text-white">Gender</option>
                            <option>Female</option>
                            <option>Male</option>
                            <option>Non-Binary</option>
                            <option>Other</option>
                        </select>
                        <input value={dob} className="bg-color2 text-white placeholder-gray-300 rounded-md border-0 focus:outline-none 
                        transition ease-in-out duration-150 p-2 w-1/2" placeholder="Date of Birth" type="text" onChange={onDOBChange}/>
                    </div>
                    <button className="bg-buttonColor hover:bg-hoverButtonColor text-white py-2 px-4 rounded-md hover:"
                            disabled={isSubmitting} onClick={onSubmit}>
                        Submit
                    </button>
                </form>
            </div>
        </div>
    )
}