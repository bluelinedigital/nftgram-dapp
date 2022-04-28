// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import 'hardhat/console.sol';

contract NFT is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenId;
    address contractAddress;

    constructor(address nftGrammAddress) ERC721("Metaverse Token", "METT") {
        contractAddress = nftGrammAddress;
    }

    function createToken(string memory tokenURI) public returns (uint) {
        _tokenId.increment();
        uint256 newItemId = _tokenId.current();

        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);
        return newItemId;
    }
}
