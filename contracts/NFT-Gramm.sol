// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import 'hardhat/console.sol';

contract NFTGramm is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private  _tokenId;
    mapping(uint256 => ImgItem) public idToImgItem;

    struct ImgItem {
        address owner;
        uint256 tokenId;
        address[] likes;
    }

    event ImgItemCreated (
        uint256 indexed tokenId,
        address owner,
        address[] likes
    );

    constructor() ERC721("Metaverse Tokens", "METT") {}

    function createToken(string memory tokenURI) public returns (uint) {
        _tokenId.increment();
        uint256 newItemId = _tokenId.current();

        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);
        createImgItem(newItemId);
        return newItemId;
    }

    function createImgItem (uint256 tokenId) private {
        idToImgItem[tokenId] = ImgItem(
            msg.sender,
            tokenId,
            new address[](0)
        );

        emit ImgItemCreated(
            tokenId,
            msg.sender,
            new address[](0)
        );
    }

    function addLike(uint tokenId) public {
        ImgItem storage item = idToImgItem[tokenId];
        int index = _checkIfLiked(item.likes);

        if(index == -1) {
            item.likes.push(msg.sender);
            idToImgItem[tokenId] = item;
        } else {
            item.likes[uint(index)] = item.likes[item.likes.length - 1];
            item.likes.pop();
        }
    }

    function fetchMyNFTs() public view returns(ImgItem[] memory) {
        uint totalItems = _tokenId.current();
        uint itemCount = 0;
        uint curretIndex = 0;

        for (uint i = 0; i < totalItems; i++) {
            if(idToImgItem[i + 1].owner == msg.sender) {
                itemCount++;
            }
        }

        ImgItem[] memory items = new ImgItem[](itemCount);
        for (uint i = 0; i < totalItems; i++) {
            if(idToImgItem[i + 1].owner == msg.sender) {
                uint currendId = idToImgItem[i + 1].tokenId;
                ImgItem storage currentItem = idToImgItem[currendId];
                items[curretIndex] = currentItem;
                curretIndex++;
            }
        }

        return items;
    }

    function fetchAvatar(uint tokenId) public view returns(ImgItem memory) {
        ImgItem storage avatar = idToImgItem[tokenId];
        return avatar;
    }

    function _checkIfLiked(address[] memory _likes) private view returns(int) {
        for(uint i = 0; i < _likes.length; i++) {
            if(_likes[i] == msg.sender) {
                return int(i);
            }
        }

        return -1;
    }
}
