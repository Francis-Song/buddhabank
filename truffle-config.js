require('dotenv').config();
const HDWalletProvider = require('@truffle/hdwallet-provider');


module.exports = {

  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*",
    },
    ropsten: {
      provider: () => {
        return new HDWalletProvider(process.env.MNEMONIC, `https://ropsten.infura.io/v3/${process.env.INFURA_API_KEY}`)
      },
      network_id: 3,
      confirmations: 10,
      timeoutBlocks: 2000,
      websockets: true,
      skipDryRun: true
    },
    kovan: {
      provider: () => {
        return new HDWalletProvider(process.env.MNEMONIC, `https://kovan.infura.io/v3/${process.env.INFURA_API_KEY}`)
      },
      network_id: 42,
      skipDryRun: true
    }

  },

  contracts_directory: "./src/contracts",
  contracts_build_directory: "./src/build",

  compilers: {
    solc: {
      version: "0.8.3",
      settings: {
        optimizer: {
          enabled: true
        }
      }
    }
  },

};
