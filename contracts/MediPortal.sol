// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.23;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "hardhat/console.sol";

import { Base64 } from "./libraries/Base64.sol";
import { ByteHasher } from "./libraries/ByteHasher.sol";

interface IWorldID {
    function verifyProof(
        uint256 root,
        uint256 groupId,
        uint256 signalHash,
        uint256 nullifierHash,
        uint256 externalNullifierHash,
        uint256[8] calldata proof
    ) external view;
}

contract MediPortal is ERC721URIStorage {
    using ByteHasher for bytes;

    // Errors
    error DuplicateNullifier(uint256 nullifierHash);

    // Number of NFTs minted
    uint256 private _tokenAmount;

    // Token name
    string private _name = "MediToken";

    // Token symbol
    string private _symbol = "MDT";

    IWorldID internal immutable worldId;

    uint256 internal immutable externalNullifier;

    uint256 internal immutable groupId = 1; // Only orb-credentials are approved on-chain

    struct MediPortalData {
        string cid; // IPFS CID
    }

    // map from WorldID nullifier hash to wallet address
    mapping(uint256 => address) private _nullifierToAddress;

    // map from wallet address to if that wallet address already minted NFT
    mapping(address => bool) private _tokenMinted;

    // Events
    event Verified(uint256 nullifierHash);
    event NFTMinted(address sender, uint256 tokenId);

    constructor(IWorldID _worldId,
                string memory _appId,
                string memory _actionId) ERC721(_name, _symbol) {
        console.log("MediPortal contract initalized");
        
        worldId = _worldId;
        externalNullifier = abi.encodePacked(abi.encodePacked(_appId).hashToField(), _actionId).hashToField();
    }

    function nullifierHashExists(uint256 nullifierHash) public view returns (bool) {
        if (_nullifierToAddress[nullifierHash] == address(0)) {
            return false;
        } else{
            return true;
        }
    }

    function verifyAndExecute(address signal, uint256 root, uint256 nullifierHash, uint256[8] calldata proof, string memory cid) public {
		// if (_nullifierToAddress[nullifierHash] != address(0) && _nullifierToAddress[nullifierHash] != signal) revert DuplicateNullifier(nullifierHash);

		// Verify World ID proof
		worldId.verifyProof(
			root,
			groupId,
			abi.encodePacked(signal).hashToField(),
			nullifierHash,
			externalNullifier,
			proof
		);

		// Map nullifier hash to user address for sybil-resistance
		_nullifierToAddress[nullifierHash] = signal;

        emit Verified(nullifierHash);

		// Mint NFT
        mintMediToken(nullifierHash, cid);
	}

    function mintMediToken(uint256 nullHash, string memory cid) public {
        // Wallet address must be equal to address with previously verified nullifier hash - this provides sybil resistance.
        require(_nullifierToAddress[nullHash] == msg.sender || _nullifierToAddress[nullHash] == address(0), "Invalid World ID!");

        // Token must not have been minted yet.
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