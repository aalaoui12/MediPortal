// context/providers.tsx
'use client';

import {PrivyProvider} from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';
import { baseSepolia } from 'viem/chains';

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
                    createOnLogin: 'users-without-wallets',
                },
                defaultChain: baseSepolia,
            }}>
            {children}
        </PrivyProvider>
    );
}