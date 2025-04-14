const hre = require("hardhat");

async function main() {
    const AadhaarNFT = await hre.ethers.getContractFactory("AadhaarNFT");
  
    // Deploy the contract
    const contract = await AadhaarNFT.deploy();
  
    // Wait for deployment to finish
    await contract.waitForDeployment();
  
    // Get contract address
    const address = await contract.getAddress();

  console.log("Contract deployed to:", address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
