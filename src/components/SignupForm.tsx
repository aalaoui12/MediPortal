'use client';

import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

import { useSmartAccount } from "../context/SmartAccountProvider";
import { postMedicalData } from "../lib/contractHelper";
import { baseSepolia } from "viem/chains";
import { decodeAbiParameters, encodeFunctionData, parseAbiParameters } from "viem";

import ABI from '../lib/abi/MediPortal.json';

interface SubmitProps {
    verified: boolean;
    authenticated: boolean;
    root: string;
    nullHash: string;
    proof: string;
}

export default function SignupForm({verified, authenticated, root, nullHash, proof}: SubmitProps) {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [id, setID] = useState('');
    const [gender, setGender] = useState('');
    const [dob, setDOB] = useState('');

    const { smartAccountAddress, smartAccountClient, eoa } = useSmartAccount();

    const isLoading = !smartAccountAddress || !smartAccountClient;
    const [isSubmitting, setIsSubmitting] = useState(false);
    const unfilled = (firstName.length === 0 || lastName.length === 0 || id.length === 0 || gender.length === 0 || dob.length === 0);

    useEffect(() => {
        console.log(dob);
    }, [dob])

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
        console.log(e.target.value);
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
                if (!smartAccountClient) return;
                const txnHash = await postMedicalData(root, nullHash, proof);

                toast.update(toastID, {
                    render: "Waiting for your transaction to be confirmed.",
                    type: "info",
                    isLoading: true,
                });

                toast.update(toastID, {
                    render: (
                      <a href={`https://sepolia.basecan.org/tx/${txnHash}`}>
                        Successfully minted! Click here to see your transaction.
                      </a>
                    ),
                    type: "success",
                    isLoading: false,
                    autoClose: 5000,
                  });


            } catch (error) {
                console.log(error);
                toast.update(toastID, {
                    render: (
                      <a>
                        There was an error sending your transaction. See the developer
                        console for more info.
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