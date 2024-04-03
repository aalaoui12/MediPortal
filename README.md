# MediPortal

Currently, patient health data is fragmented and unsafe from hackers as hospitals tend to keep this information separately. Not only is this redundant and unsafe, and makes healthcare less efficient, but it is also hard for patients themselves to access this data. In 2023 alone, over 133 million healthcare records were exposed due to data breaches.

MediPortal is an on-chain app that allows patients to upload their encrypted patient records, and then share these records with doctors as needed. Once a patient uploads their records, they are able to mint an NFT that secures their medical records.

This project uses Solidity and Typescript, as well as permissionless.js and Privy to provide every patient with a smart account.

## How to use

Simply sign in with your email address, and then verify with Worldcoin by using the [Worldcoin Simulator](https://simulator.worldcoin.org).

After that, just fill out the form, and MediPortal will upload the encrypted records to IPFS and then mint an NFT on Base Sepolia that points to this IPFS link. 

MediPortal will sponsor the gas costs used to mint this NFT, so you don't have to do anything else.