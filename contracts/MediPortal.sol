// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.23;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "hardhat/console.sol";

import { Base64 } from "./libraries/Base64.sol";

contract MediPortal is ERC721URIStorage {
    // Number of NFTs minted
    uint256 private _tokenAmount;

    // Token name
    string private _name = "MediToken";

    // Token symbol
    string private _symbol = "MDT";

    constructor() ERC721 (_name, _symbol) {
        console.log("MediPortal contract initalized");
    }

    struct MediPortalData {
        string cid; // IPFS CID
    }

    // map from WorldID nullifier hash to wallet address
    mapping(uint256 => address) private _nullifierToAddress;

    // map from wallet address to if that wallet address already minted NFT
    mapping(address => bool) private _tokenMinted;
    

    // Events
    event NFTMinted(address sender, uint256 tokenId);

    function mintMediToken(string memory cid) public {
        require(!_tokenMinted[msg.sender], "Patient data already minted");

        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"cid": "', cid,'"}'
                    )
                )
            )
        );

        uint256 newItemId = _tokenAmount;
        _safeMint(msg.sender, newItemId);

        string memory NFTUri = string(
            abi.encode("data:application/json;base64,", json)
        );

        _setTokenURI(newItemId, NFTUri);
        _tokenAmount += 1;
        emit NFTMinted(msg.sender, newItemId);
    }
}