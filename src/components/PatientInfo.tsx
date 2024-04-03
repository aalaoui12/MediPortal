import React from "react";
import { PatientProps } from "./Profile";

export default function PatientInformation({name, id, gender, dob}: PatientProps) {
    return (
        <div className="text-white">
            <p className="pb-2">Name: {name}</p>
            <p className="pb-2">ID Number: {id}</p>
            <p className="pb-2">Gender: {gender}</p>
            <p className="pb-2">Date of Birth: {dob}</p>
        </div>
    )
}