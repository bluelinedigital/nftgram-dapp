const fs = require('fs');
const hre = require("hardhat");

async function main() {
  const NFTGramm = await hre.ethers.getContractFactory("NFTGramm");
  const SubContract = await hre.ethers.getContractFactory("SubContract");
  const nftGramm = await NFTGramm.deploy();
  const subContract = await SubContract.deploy();
  await nftGramm.deployed();
  await subContract.deployed();

  console.log("NFTGramm deployed to:", nftGramm.address);
  console.log("SubContract deployed to:", subContract.address);

    fs.writeFileSync('./config.js', `
  export const nftGramm = "${nftGramm.address}"
  export const subContract = "${subContract.address}"
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
