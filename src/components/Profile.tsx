import React, { useState } from "react";
import PatientInformation from "./PatientInfo";

export interface PatientProps {
    name: string;
    id: string;
    gender: string;
    dob: string;
}

export default function Profile({name, id, gender, dob}: PatientProps) {
    const [activeTab, setActiveTab] = useState(0);

    const tabTitles = ['Personal Information', 'Prior Visits', 'Diagnoses'];

    // TO DO: Update other tabs once doctors have ability to post diagnoses and visit history
    return (
        <div className="flex flex-col items-center h-screen">
            <div className="flex flex-col items-center w-full bg-color1/90 rounded-xl shadow-md pt-4 pb-2 px-8 mt-4">
                <h2 className="text-2xl text-white">Your Medical Profile</h2>
                <ul className="flex flex-wrap py-4 text-sm font-medium text-center text-gray-500 dark:text-gray-400">
                    {tabTitles.map((item, index) => (
                        <li
                        className={`inline-block px-4 mx-1 py-3 rounded-lg cursor-pointer text-white ${index === activeTab ? 'bg-buttonColor active' : 'hover:bg-buttonColor'}`}
                        key={item}
                        onClick={() => setActiveTab(index)}>
                            {item}
                        </li>
                    ))}
                </ul>
                <div className="self-start pt-4 pb-10">
                    {activeTab === 0 ? <PatientInformation name={name} id={id} gender={gender} dob={dob}/> : <p className="text-white">No information to show here.</p>}
                </div>
            </div>
        </div>
    )
}