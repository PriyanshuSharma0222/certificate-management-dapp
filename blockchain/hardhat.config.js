require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.20",
  networks: {
    ganache: {
      url: "http://127.0.0.1:7545",
      accounts: [
        "0xa82545d49310f3cbd5fe2dd41f09f28f9ec80bb1595c6bf78b7a29aab8a92533"
      ]
    }
  }
};