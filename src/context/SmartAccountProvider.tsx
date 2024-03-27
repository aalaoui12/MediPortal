'use client';

import { ENTRYPOINT_ADDRESS_V07, createSmartAccountClient, walletClientToSmartAccountSigner } from "permissionless";
import { createPimlicoBundlerClient, createPimlicoPaymasterClient } from "permissionless/clients/pimlico";
import { useWallets } from "@privy-io/react-auth";
import React, { createContext, useEffect, useState } from "react";
import { createPublicClient, createWalletClient, custom, http } from "viem";
import { baseSepolia } from "viem/chains";
import { signerToSafeSmartAccount } from "permissionless/accounts";

export const SmartAccountContext = createContext<ReturnType<typeof createSmartAccountClient> | null>(null);

export const SmartAccountProvider = ({children}: {children: React.ReactNode}) => {
    const {wallets} = useWallets();
    const embeddedWallet = wallets.find((wallet) => (wallet.walletClientType === 'privy'));
    
    const [smartAccountClient, setSmartAccountClient] = useState<ReturnType<typeof createSmartAccountClient> | null>(null);

    const init = async () => {
        if (!embeddedWallet) return;

        const eip1193provider = await embeddedWallet.getEthereumProvider();
        const privyClient = createWalletClient({
            account: embeddedWallet.address as `0x${string}`,
            chain: baseSepolia, // Replace this with the chain used by your application
            transport: custom(eip1193provider)
        });

        const customSigner = walletClientToSmartAccountSigner(privyClient);

        const publicClient = createPublicClient({
            chain: baseSepolia,
            transport: http(),
        });

        const safeAccount = await signerToSafeSmartAccount(publicClient, {
            entryPoint: ENTRYPOINT_ADDRESS_V07,
            signer: customSigner,
            safeVersion: '1.4.1',
        });

        const pimlicoPaymaster = createPimlicoPaymasterClient({
            transport: http(process.env.NEXT_PUBLIC_PIMLICO_PAYMASTER),
            entryPoint: ENTRYPOINT_ADDRESS_V07,
        });

        const pimlicoBundler = createPimlicoBundlerClient({
            transport: http(process.env.NEXT_PUBLIC_PIMLICO_BUNDLER),
            entryPoint: ENTRYPOINT_ADDRESS_V07,
        });

        const safeAccountClient = createSmartAccountClient({
            account: safeAccount,
            entryPoint: ENTRYPOINT_ADDRESS_V07,
            chain: baseSepolia,
            bundlerTransport: http(process.env.NEXT_PUBLIC_PIMLICO_BUNDLER),
            middleware: {
                sponsorUserOperation: pimlicoPaymaster.sponsorUserOperation,
            },
        });
        setSmartAccountClient(safeAccountClient as ReturnType<typeof createSmartAccountClient>);
    }

    useEffect(() => {
        init();
    }, [embeddedWallet?.address]);

    return (
        <SmartAccountContext.Provider value={smartAccountClient}>{children}</SmartAccountContext.Provider>
    );
}