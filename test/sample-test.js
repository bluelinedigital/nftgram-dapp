const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NFTGramm and SubContract", function () {
  it("Should create and return nfts", async function () {
     const NFTGramm = await ethers.getContractFactory("NFTGramm");
     const SubContract = await ethers.getContractFactory("SubContract");
     const nftGramm = await NFTGramm.deploy();
     const subContract = await SubContract.deploy();
     await nftGramm.deployed();
     await subContract.deployed();

     const [firstUser, secondUser, thirdUser] = await ethers.getSigners();

     await subContract.createUser();
     await subContract.connect(secondUser).createUser();
     await subContract.connect(thirdUser).createUser();

     await subContract.subscribe(secondUser.address);
     await subContract.subscribe(thirdUser.address);
     await subContract.subscribe(secondUser.address);
     await subContract.connect(secondUser).subscribe(firstUser.address);

     await nftGramm.createToken("https://dev-app.usekyleapp.com/hiphoprap.jpg");
     await nftGramm.createToken("https://dev-app.usekyleapp.com/hiphoprap.jpg");


     await nftGramm.addLike(1);
     await nftGramm.connect(secondUser).addLike(1);
     await nftGramm.connect(thirdUser).addLike(1);
     await nftGramm.addLike(1);
     await nftGramm.addLike(2);

     let mySubs = await subContract.fetchMySubs();
     let secondUserSub = await subContract.connect(secondUser).fetchMySubs();
     let thirdUserSub = await subContract.connect(thirdUser).fetchMySubs();

     let avatar = await nftGramm.fetchAvatar(1);

     avatar = await Promise.resolve({
        tokenId: avatar.tokenId.toNumber(),
        owner: avatar.owner,
        tokenUri: await nftGramm.tokenURI(avatar.tokenId),
        likes: avatar.likes,
     }).then((av) => av);

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

     console.log(avatar);
  });
});
