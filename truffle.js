const { readFileSync } = require('fs')
// const HDWalletProvider = require("@truffle/hdwallet-provider")

const privateKey = readFileSync('./.private-key.txt').toString().trim()
if (!privateKey) {
  console.error("`.private-key.txt` is empty - paste a valid private key in there")
  process.exit(1)
}

// const provider = new HDWalletProvider({
//   privateKeys: [privateKey],
//   providerOrUrl: "https://node.cheapeth.org/rpc",
// })

module.exports = {
  networks: {
    // default network - provider ganache (Desktop/GUI version)
    development: {
      host: "127.0.0.1",
      port: 7545, // change this to 8545
      network_id: "*",
      from: "0x41c64b7E41D78e043b70C6d56E334799b801ba01" // account #0
    },
    // cheapeth: {
    //   provider: () => provider,
    //   gasPrice: "1000000000", // 1 gwei
    //   network_id: 777,
    //   skipDryRun: true,
    //   shareNonce: true,
    // }
  },
  compilers: {
    solc: {
      version: "0.8.3",
    }
  }
}
