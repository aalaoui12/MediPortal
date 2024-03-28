import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import { config as dotEnvConfig } from "dotenv";

dotEnvConfig();

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  networks: {
    'base-sepolia': {
      url: `https://base-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
      accounts: [process.env.SEPOLIA_PRIVATE_KEY!],
    },
  },
  etherscan: {
    apiKey: {
     "base-sepolia": process.env.BASESCAN_API_KEY!
    },
    customChains: [
      {
        network: "base-sepolia",
        chainId: 84532,
        urls: {
         apiURL: "https://api-sepolia.basescan.org/api",
         browserURL: "https://sepolia.basescan.org"
        }
      }
    ]
  },
};

export default config;
