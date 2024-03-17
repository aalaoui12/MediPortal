import {
  ENTRYPOINT_ADDRESS_V06,
  createSmartAccountClient,
  walletClientToSmartAccountSigner,
} from "permissionless";
import { signerToSafeSmartAccount } from "permissionless/accounts";
import { usePublicClient, useWalletClient } from "wagmi";
import { http, createPublicClient } from "viem";
import { baseSepolia, sepolia } from "viem/chains";
import { PrivateKeyAccount, privateKeyToAccount } from "viem/accounts";
import { useEffect } from "react";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { pimlicoPaymasterClient } from "./paymaster";

export const Pimlico = ({ smartAccount, setSmartAccount }) => {
  const { primaryWallet } = useDynamicContext();

  // const publicClient = usePublicClient();

  const { data: walletClient } = useWalletClient();

  const init = async () => {
    console.log("Initializing Pimlico");

    const signer = privateKeyToAccount(process.env.PRIVATE_KEY);
    const customSigner = walletClientToSmartAccountSigner(walletClient);

    const publicClient = createPublicClient({
      transport: http("https://rpc.ankr.com/base_sepolia"),
    })

    const safeAccount = await signerToSafeSmartAccount(publicClient,
      {
        entryPoint: ENTRYPOINT_ADDRESS_V06,
        signer: signer,
        safeVersion: "1.4.1",
      });

    console.log("hi there");

    const smartAccountClient = createSmartAccountClient({
      account: safeAccount,
      chain: baseSepolia, // or whatever chain you are using
      bundlerTransport: http(
        `https://api.pimlico.io/v2/84532/rpc?apikey=48c7b97b-743a-4592-871d-992aa983510a`
      ),
      middleware: {
        sponsorUserOperation: pimlicoPaymasterClient.sponsorUserOperation, // if using a paymaster
      },
    });

    setSmartAccount(smartAccountClient);
  };

  useEffect(() => {
    if (primaryWallet?.authenticated && !smartAccount) init();
  }, [primaryWallet, smartAccount]);

  return <></>;
};
