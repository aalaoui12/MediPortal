'use client';
import Image from "next/image";

import { PrivyProvider } from "@privy-io/react-auth";
import { createConfig, WagmiProvider } from "wagmi";
import { baseSepolia } from "viem/chains";
import { http } from "viem";
import MediPortal from "./MediPortal";
import { useRouter } from "next/navigation";

export default function Home() {
  // const router = useRouter();
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
