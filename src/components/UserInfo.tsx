import { PrivyInterface } from "@privy-io/react-auth";
import React from "react";

import { formatWallet } from "../lib/utils";

interface Props {
    user: PrivyInterface["user"];
}

export default function UserInfo({user}: Props) {
    return (
        <p className="text-white">
            {user?.email ? user.email.address : user?.google ? user.google.email : formatWallet(user?.wallet?.address)}
        </p>
    )
}