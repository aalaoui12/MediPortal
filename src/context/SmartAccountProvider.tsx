'use client';

import { ENTRYPOINT_ADDRESS_V07, createSmartAccountClient, walletClientToSmartAccountSigner, type SmartAccountClient } from "permissionless";
import { createPimlicoBundlerClient, createPimlicoPaymasterClient } from "permissionless/clients/pimlico";
import { ConnectedWallet, usePrivy, useWallets } from "@privy-io/react-auth";
import React, { createContext, useContext, useEffect, useState } from "react";
import { createPublicClient, createWalletClient, custom, http } from "viem";
import { baseSepolia } from "viem/chains";
import { signerToSafeSmartAccount } from "permissionless/accounts";
import { ENTRYPOINT_ADDRESS_V07_TYPE } from "permissionless/_types/types";

interface SmartAccountInterface {
    eoa: ConnectedWallet | undefined;
    smartAccountClient: SmartAccountClient<ENTRYPOINT_ADDRESS_V07_TYPE> | undefined;
    smartAccountAddress: `0x${string}` | undefined;
    smartAccountReady: boolean;
  }
  
export const SmartAccountContext = createContext<SmartAccountInterface>({
    eoa: undefined,
    smartAccountClient: undefined,
    smartAccountAddress: undefined,
    smartAccountReady: false,
});
  
export const useSmartAccount = () => {
    return useContext(SmartAccountContext);
};

// export const SmartAccountContext = createContext<ReturnType<typeof createSmartAccountClient> | null>(null);

export const SmartAccountProvider = ({children}: {children: React.ReactNode}) => {
    const {wallets} = useWallets();
    const embeddedWallet = wallets[0]; // Either Privy or user's own EOA
    
    // const [smartAccountClient, setSmartAccountClient] = useState<ReturnType<typeof createSmartAccountClient> | null>(null);
    const [eoa, setEoa] = useState<ConnectedWallet | undefined>();
    const [smartAccountClient, setSmartAccountClient] = useState<SmartAccountClient<ENTRYPOINT_ADDRESS_V07_TYPE> | undefined>();
    const [smartAccountAddress, setSmartAccountAddress] = useState<`0x${string}` | undefined>();
    const [smartAccountReady, setSmartAccountReady] = useState(false);

    const init = async () => {
        console.log(wallets);
        if (!embeddedWallet) {
            console.log("embedded wallet does not exist!");
            return;
        }

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
        // setSmartAccountClient(safeAccountClient as ReturnType<typeof createSmartAccountClient>);
        const safeAccountAddress = safeAccountClient.account?.address;

        setSmartAccountClient(safeAccountClient);
        setSmartAccountAddress(safeAccountAddress);
        setSmartAccountReady(true);
    }

    useEffect(() => {
        console.log("reloading smart account");
        init();
    }, [embeddedWallet?.address]);

    return (
        <SmartAccountContext.Provider
          value={{
            smartAccountReady: smartAccountReady,
            smartAccountClient: smartAccountClient,
            smartAccountAddress: smartAccountAddress,
            eoa: eoa,
          }}
        >
          {children}
        </SmartAccountContext.Provider>
      );
}