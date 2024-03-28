'use client';

import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

interface Checks {
    verified: boolean;
    authenticated: boolean;
}

export default function SignupForm({verified, authenticated}: Checks) {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [id, setID] = useState('');
    const [gender, setGender] = useState('');
    const [dob, setDOB] = useState('');

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

    function onSubmit() {
        if (!authenticated) {
            toast("You are not signed in!", {
                position: "top-center",
                hideProgressBar: true
            });
        }
        else if (!verified) {
            toast("You need to verify your identity with World ID! Use the Worldcoin simulator.", {
                position: "top-center",
                hideProgressBar: true
            });
        }
        else {
            return;
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
                            onClick={onSubmit}>
                        Submit
                    </button>
                </form>
            </div>
        </div>
    )
}