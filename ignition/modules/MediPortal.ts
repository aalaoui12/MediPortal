import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { config as dotEnvConfig } from "dotenv";

dotEnvConfig();

const MediPortalModule = buildModule("MediPortalModule", (m) => {
    const mediPortal = m.contract("MediPortal", [process.env.NEXT_PUBLIC_BASE_WORLD_ID_ROUTER!,
                                                 process.env.NEXT_PUBLIC_WORLD_ID_APP_ID!,
                                                 'mint_meditoken']);

    m.call(mediPortal, "mintMediToken", [30, process.env.IPFS_TEST_CID!]);

    return { mediPortal };
});

export default MediPortalModule;