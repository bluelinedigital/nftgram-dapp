const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NFTGramm", function () {
  it("Should create and return nfts", async function () {
     const NFTGramm = await ethers.getContractFactory("NFTGramm");
     const nftGramm = await NFTGramm.deploy();
     await nftGramm.deployed();

     await nftGramm.createToken("https://dev-app.usekyleapp.com/hiphoprap.jpg");
     await nftGramm.createToken("https://dev-app.usekyleapp.com/hiphoprap.jpg");

     const [_, secondUser, thirdUser] = await ethers.getSigners();

     await nftGramm.addLike(1);
     await nftGramm.connect(secondUser).addLike(1);
     await nftGramm.connect(thirdUser).addLike(1);
     await nftGramm.addLike(1);
     await nftGramm.addLike(2);

     let items = await nftGramm.fetchMyNFTs();

     items = await Promise.all(items.map(async i => {
        const tokenUri = await nftGramm.tokenURI(i.tokenId)
        return {
           tokenId: i.tokenId.toNumber(),
           owner: i.owner,
           tokenUri,
           likes: i.likes,
        }
     }));

     console.log(items);
  });
});
