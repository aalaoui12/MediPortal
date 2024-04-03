// context/providers.tsx
'use client';

import {PrivyProvider} from '@privy-io/react-auth';
import { createConfig, WagmiProvider } from "@privy-io/wagmi";
import {http} from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useRouter } from 'next/navigation';
import { baseSepolia } from 'viem/chains';

const queryClient = new QueryClient(); // Privy + wagmi, including queryClient and WagmiProvider

export const config = createConfig({
    chains: [baseSepolia],
    transports: {
      [baseSepolia.id]: http(),
    },
  });

export default function Providers({children}: {children: React.ReactNode}) {
    const router = useRouter();
    return (
        <PrivyProvider
            appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
            config={{
                appearance: {
                theme: 'light',
                accentColor: '#676FFF',
                logo: '',
            },
                embeddedWallets: {
                    createOnLogin: 'all-users',
                },
                defaultChain: baseSepolia,
            }}>
            <QueryClientProvider client={queryClient}>
            <WagmiProvider config={config}>
                {children}
            </WagmiProvider>
          </QueryClientProvider>
        </PrivyProvider>
    );
}