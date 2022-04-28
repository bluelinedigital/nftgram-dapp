const fs = require('fs');
const hre = require("hardhat");

async function main() {
  const NFTGramm = await hre.ethers.getContractFactory("NFTGramm");
  const nftGramm = await NFTGramm.deploy();
  await nftGramm.deployed();

  console.log("NFTGramm deployed to:", nftGramm.address);

    fs.writeFileSync('./config.js', `
  export const nftGramm = "${nftGramm.address}"
  `)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
