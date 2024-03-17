'use client';
import Image from "next/image";

import { ThirdwebProvider } from "@thirdweb-dev/react";
import MediPortal from "./MediPortal";

export default function Home() {
  return (
    <ThirdwebProvider>
      <MediPortal/>
    </ThirdwebProvider>
  );
}
