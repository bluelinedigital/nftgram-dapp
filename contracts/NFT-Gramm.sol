// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import 'hardhat/console.sol';
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NFTGramm {
    using Counters for Counters.Counter;
    Counters.Counter private _imgIds;
    mapping(uint256 => ImgItem) public idToImgItem;

    struct ImgItem {
        uint   imgId;
        address owner;
        address nftContract;
        uint256 tokenId;
        address[] likes;
    }

    event ImgItemCreated (
        uint  indexed  imgId,
        address indexed nftContract,
        uint256 indexed tokenId,
        address owner,
        address[] likes
    );

    function createImgItem (address nftContract, uint256 tokenId) public {
        _imgIds.increment();
        uint256 imgId = _imgIds.current();

        idToImgItem[imgId] = ImgItem(
            imgId,
            msg.sender,
            nftContract,
            tokenId,
            new address[](0)
        );

        emit ImgItemCreated(
            imgId,
            nftContract,
            tokenId,
            msg.sender,
            new address[](0)
        );
    }

    function addLike(uint imgId) public {
        ImgItem storage item = idToImgItem[imgId];

        require(CheckIfLiked(item.likes), "You have already liked this image");

        item.likes.push(msg.sender);
        idToImgItem[imgId] = item;
    }

    function fetchMyNFTs() public view returns(ImgItem[] memory) {
        uint totalItems = _imgIds.current();
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
                uint currendId = idToImgItem[i + 1].imgId;
                ImgItem storage currentItem = idToImgItem[currendId];
                items[curretIndex] = currentItem;
                curretIndex++;
            }
        }

        return items;
    }

    function CheckIfLiked(address[] memory _likes) private view returns(bool) {
        for(uint i = 0; i < _likes.length; i++) {
            if(_likes[i] == msg.sender) {
                return false;
            }
        }

        return true;
    }
}
