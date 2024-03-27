import { PrivyInterface } from "@privy-io/react-auth";
import React from "react";

import { formatWallet } from "../lib/utils";

interface Props {
    user: PrivyInterface["user"];
}

export default function UserInfo(props: Props) {
    return (
        <p className="text-white">
            {props?.user?.email ? props.user.email.address : props?.user?.google ? props.user.google.email : formatWallet(props?.user?.wallet?.address)}
        </p>
    )
}