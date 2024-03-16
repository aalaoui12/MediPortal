// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.23;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract MediPortal {
    struct data {
        string cid;
    }

    // map from WorldID nullifier hash to wallet address
    mapping(uint256 => address) private _nullifierToAddress;


    // Events

    // Token name
    string private _name = "MediToken";

    // Token symbol
    string private _symbol = "MDT";
}