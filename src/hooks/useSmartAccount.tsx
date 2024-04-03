'use client';
import { SmartAccountContext } from "../context/SmartAccountProvider";
import { useContext } from "react";

export const useSmartAccount = () => {
    const client = useContext(SmartAccountContext);
    console.log(client);
    return client;
}