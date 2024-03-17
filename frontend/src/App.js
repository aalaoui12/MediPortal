import {
  DynamicContextProvider,
  DynamicWidget,
} from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { DynamicWagmiConnector } from "@dynamic-labs/wagmi-connector";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createConfig, useAccount, WagmiProvider } from "wagmi";
import { mainnet } from "viem/chains";
import { http } from "viem";
import { Pimlico } from "./Pimlico";

import { IDKitWidget } from "@worldcoin/idkit";

import { useEffect, useState } from "react";

const App = () => {
  const address = useAccount();
  const [smartAccount, setSmartAccount] = useState(null);

  /*
  const config = createConfig({
    chains: [mainnet],
    multiInjectedProviderDiscovery: false,
    transports: {
      [mainnet.id]: http(),
    },
  });
  */

  const queryClient = new QueryClient();

  function onSuccess(response) {
    console.log("success");
  }

  useEffect(() => {
    if (smartAccount) console.log("Smart Account: ", smartAccount);
  }, [smartAccount]);

  return (
    <div className="App">
      <div className="flex flex-col space-y-2">
        <QueryClientProvider client={queryClient}>
            <DynamicWagmiConnector>
              <DynamicWidget />
                <Pimlico
                  smartAccount={smartAccount}
                  setSmartAccount={setSmartAccount}
                />
            </DynamicWagmiConnector>
        </QueryClientProvider>
      </div>
    </div>
  );
};

export default App;
