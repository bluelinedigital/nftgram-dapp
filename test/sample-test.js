const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NFTGramm", function () {
  it("Should create and return nfts", async function () {
     const Gramm = await ethers.getContractFactory("NFTGramm");
     const gramm = await Gramm.deploy();
     await gramm.deployed();
     const grammAdress = gramm.address;

     const NFT = await ethers.getContractFactory("NFT");
     const nft = await NFT.deploy(grammAdress);
     await nft.deployed();
     const nftContractAdress = nft.address;

     const id1 = await nft.createToken("https://dev-app.usekyleapp.com/hiphoprap.jpg");
     const id2 = await nft.createToken("https://dev-app.usekyleapp.com/hiphoprap.jpg");


     await gramm.createImgItem(nftContractAdress, 1);
     await gramm.createImgItem(nftContractAdress, 2);

     await gramm.addLike(1);
     // await gramm.addLike(1);

     const items = await gramm.fetchMyNFTs();

     console.log(items);
  });
});
