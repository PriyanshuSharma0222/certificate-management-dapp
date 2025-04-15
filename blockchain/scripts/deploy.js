const hre = require("hardhat");

async function main() {
    const DocumentNFT = await hre.ethers.getContractFactory("DocumentNFT");
  
    // Deploy the contract
    const contract = await DocumentNFT.deploy();
  
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
