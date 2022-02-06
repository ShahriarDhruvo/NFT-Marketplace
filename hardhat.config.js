require("@nomiclabs/hardhat-waffle");
const fs = require('fs');

const PROJECT_ID = "42c8fea10f49449fa7794c65c462fb4b"; 
const keyData = fs.readFileSync('./.secret', {
  encoding: 'utf-8', flag: 'r'
});

module.exports = {
  defaultNetwork: "hardhat",
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enable: true,
        runs: 200
      }
    }
  },
  networks: {
    hardhat: {
      chainId: 1337
    },
    ropsten: {
      url: `https://ropsten.infura.io/v3/${PROJECT_ID}`,
      accounts: [keyData]
    },
    mainnet: {
      url: `https://mainnet.infura.io/v3/${PROJECT_ID}`,
      accounts: [keyData]
    },
    mumbai: {
      url: `https://polygon-mumbai.infura.io/v3/${PROJECT_ID}`,
      accounts: [keyData]
    },
  }
};
