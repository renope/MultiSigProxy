require("@nomicfoundation/hardhat-toolbox");

const { PRIVATE_KEY, POLYGONSCAN_API_KEY } = require('./secret.json');

module.exports = {
  solidity: {
  version: "0.8.17",
  settings: {
    optimizer: {
      enabled: true,
      runs: 100000,
    }
   }
  },
  networks: {
    polygon: {
      url: `https://polygon-rpc.com/`,
      accounts: [`0x${PRIVATE_KEY}`],
    },
    polygonMumbai: {
      url: `https://matic-mumbai.chainstacklabs.com`,
      accounts: [`0x${PRIVATE_KEY}`],
    },
  },
  etherscan: {
    apiKey: {
      polygon: `${POLYGONSCAN_API_KEY}`,
      polygonMumbai: `${POLYGONSCAN_API_KEY}`,
    }
  },
};
