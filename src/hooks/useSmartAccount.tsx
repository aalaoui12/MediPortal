'use client';
import { SmartAccountProvider } from "../context/SmartAccountProvider";
import { useContext } from "react";

export const useSmartAccount = () => {
    return useContext(SmartAccountProvider);
}