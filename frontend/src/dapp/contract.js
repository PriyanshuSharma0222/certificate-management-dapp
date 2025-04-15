import { ethers, Log } from "ethers";
import DocumentNFT from "./abi/DocumentNFT.json";
import { CONTRACT_ADDRESS } from "./contract-address";

export const getContract = async () => {
  if (!window.ethereum) {
    alert("Install MetaMask");
    return null;
  }
  console.log("getContract() is called.");
  
  const provider = new ethers.BrowserProvider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(CONTRACT_ADDRESS, DocumentNFT.abi, signer);
  return contract;
};
