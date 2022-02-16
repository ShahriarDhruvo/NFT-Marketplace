require("@nomiclabs/hardhat-waffle");
const fs = require('fs');

const PROJECT_ID = "7a7abab104ac461cb9a143d47a87355e"; 
const keyData = fs.readFileSync('./.secret', {
  encoding: 'utf-8', flag: 'r'
});

module.exports = {
  defaultNetwork: "hardhat",
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
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
