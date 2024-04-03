'use client';

import { ENTRYPOINT_ADDRESS_V07, createSmartAccountClient, walletClientToSmartAccountSigner, type SmartAccountClient, ENTRYPOINT_ADDRESS_V06 } from "permissionless";
import { createPimlicoBundlerClient, createPimlicoPaymasterClient } from "permissionless/clients/pimlico";
import { ConnectedWallet, usePrivy, useWallets } from "@privy-io/react-auth";
import React, { createContext, useContext, useEffect, useState } from "react";
import { WalletClient, createPublicClient, createWalletClient, custom, http } from "viem";
import { baseSepolia } from "viem/chains";
import { signerToSafeSmartAccount } from "permissionless/accounts";
import { ENTRYPOINT_ADDRESS_V07_TYPE, ENTRYPOINT_ADDRESS_V06_TYPE } from "permissionless/_types/types";
import { SmartAccountSigner } from "permissionless/_types/accounts";
import { useSetActiveWallet } from "@privy-io/wagmi";
import { useWalletClient } from "wagmi";

interface SmartAccountInterface {
    eoa: ConnectedWallet | undefined;
    privyClient: WalletClient | undefined;
    smartAccountSigner: SmartAccountSigner | undefined;
    smartAccountClient: SmartAccountClient<ENTRYPOINT_ADDRESS_V06_TYPE> | undefined;
    smartAccountAddress: `0x${string}` | undefined;
    smartAccountReady: boolean;
  }
  
export const SmartAccountContext = createContext<SmartAccountInterface>({
    eoa: undefined,
    privyClient: undefined,
    smartAccountSigner: undefined,
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
    const {
        data: walletClient
    } = useWalletClient(); // Privy + Wagmi

    // const embeddedWallet = wallets[0]; // Either Privy or user's own EOA
    const embeddedWallet = wallets.find(
        (wallet) => wallet.walletClientType === "privy"
    );
    const { setActiveWallet } = useSetActiveWallet();
    
    // const [smartAccountClient, setSmartAccountClient] = useState<ReturnType<typeof createSmartAccountClient> | null>(null);
    const [eoa, setEoa] = useState<ConnectedWallet | undefined>();
    const [privyClient, setPrivyClient] = useState<WalletClient | undefined>();
    const [smartAccountSigner, setSmartAccountSigner] = useState<SmartAccountSigner | undefined>();
    const [smartAccountClient, setSmartAccountClient] = useState<SmartAccountClient<ENTRYPOINT_ADDRESS_V06_TYPE> | undefined>();
    const [smartAccountAddress, setSmartAccountAddress] = useState<`0x${string}` | undefined>();
    const [smartAccountReady, setSmartAccountReady] = useState(false);

    const init = async () => {
        console.log(wallets);
        if (!embeddedWallet || !walletClient) {
            console.log("embedded wallet does not exist!");
            return;
        }
        await setActiveWallet(embeddedWallet!);

        // const eip1193provider = await embeddedWallet.getEthereumProvider();
        /*
        const privyClient = createWalletClient({
            account: embeddedWallet.address as `0x${string}`,
            chain: baseSepolia,
            transport: custom(eip1193provider)
        });
        */


        // const customSigner = walletClientToSmartAccountSigner(privyClient);
        const customSigner = walletClientToSmartAccountSigner(walletClient!);

        const publicClient = createPublicClient({
            chain: baseSepolia,
            transport: http(),
        });

        const safeAccount = await signerToSafeSmartAccount(publicClient, {
            entryPoint: ENTRYPOINT_ADDRESS_V06,
            signer: customSigner,
            safeVersion: '1.4.1',
        });

        const pimlicoPaymaster = createPimlicoPaymasterClient({
            transport: http(process.env.NEXT_PUBLIC_PIMLICO_PAYMASTER),
            entryPoint: ENTRYPOINT_ADDRESS_V06,
        });

        const pimlicoBundler = createPimlicoBundlerClient({
            transport: http(process.env.NEXT_PUBLIC_PIMLICO_BUNDLER),
            entryPoint: ENTRYPOINT_ADDRESS_V06,
        });

        const safeAccountClient = createSmartAccountClient({
            account: safeAccount,
            entryPoint: ENTRYPOINT_ADDRESS_V06,
            chain: baseSepolia,
            bundlerTransport: http(process.env.NEXT_PUBLIC_PIMLICO_BUNDLER),
            middleware: {
                gasPrice: async () => (await pimlicoBundler.getUserOperationGasPrice()).fast, // use pimlico bundler to get gas prices, if using pimlico
                sponsorUserOperation: pimlicoPaymaster.sponsorUserOperation, // optional
            },
        });
        // setSmartAccountClient(safeAccountClient as ReturnType<typeof createSmartAccountClient>);
        const safeAccountAddress = safeAccountClient.account?.address;

        setPrivyClient(walletClient);
        setSmartAccountSigner(customSigner);
        setSmartAccountClient(safeAccountClient);
        setSmartAccountAddress(safeAccountAddress);
        setSmartAccountReady(true);
    }

    useEffect(() => {
        console.log("reloading smart account");
        init();
    }, [embeddedWallet, walletClient]);

    return (
        <SmartAccountContext.Provider
          value={{
            privyClient: privyClient,
            smartAccountSigner: smartAccountSigner,
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