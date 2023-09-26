require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  networks: {
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/c29arfBNvRoK-p-Fm4keFN2Jm23MR4Kd",
      accounts: ['ee89fb0eca73f9d6d36d1020d2cd241341d41b768f73c4b5d5a523e7cef81747']
    },
  }
};
