'use client';
import Image from "next/image";

import {
  DynamicContextProvider,
  DynamicWidget,
} from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { DynamicWagmiConnector } from "@dynamic-labs/wagmi-connector";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createConfig, WagmiProvider } from "wagmi";
import { mainnet } from "viem/chains";
import { http } from "viem";

import { useEffect, useState } from "react";

import MediPortal from "./MediPortal";

export default function Home() {
  const config = createConfig({
    chains: [mainnet],
    multiInjectedProviderDiscovery: false,
    transports: {
      [mainnet.id]: http(),
    },
  });

  const queryClient = new QueryClient();

  return (
    <DynamicContextProvider
      settings={{
        environmentId: process.env.NEXT_PUBLIC_REACT_APP_DYNAMIC_ENVIRONMENT_ID,
        walletConnectors: [EthereumWalletConnectors],
      }}
    >
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <DynamicWagmiConnector>
            <MediPortal/>
          </DynamicWagmiConnector>
        </QueryClientProvider>
      </WagmiProvider>
    </DynamicContextProvider>
  );
}
