import lighthouse from '@lighthouse-web3/sdk';

const apiKey = "af348d36.445d284e2aca4ac082983d6459006ade"

export const storeDocMetadata = async (docData) => {
  try {
    const blob = new Blob([JSON.stringify(docData)], { type: 'application/json' });
    const file = new File([blob], 'aadhaar.json', { type: 'application/json' });

    const response = await lighthouse.uploadBuffer(file, apiKey, false, {
      name: 'Aadhaar Metadata'
    });

    console.log("Uploaded to IPFS:", response.data.Hash);
    return response.data.Hash;
  } catch (err) {
    console.error("IPFS Upload Error:", err.message);
    throw err;
  }
};