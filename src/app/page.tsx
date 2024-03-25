'use client';
import Image from "next/image";

import { createConfig, WagmiProvider } from "wagmi";
import { baseSepolia } from "viem/chains";
import { http } from "viem";
import MediPortal from "./MediPortal";

export default function Home() {
  const config = createConfig({
    chains: [baseSepolia],
    multiInjectedProviderDiscovery: false,
    transports: {
      [baseSepolia.id]: http(),
    },
  });
  return (
    <WagmiProvider config={config}>
      <MediPortal/>
    </WagmiProvider>
  );
}
