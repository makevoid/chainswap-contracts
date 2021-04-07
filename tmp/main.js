// #! /usr/bin/env node
//
// const { readFileSync, existsSync } = require('fs')
// const Web3 = require('web3')
//
// const web3 = new Web3("https://node.cheapeth.org/rpc")
// const eth = web3.eth
//
// const privateKeyFile = "./.private-key2.txt"
//
// const contractName = "SimpleStorage"
// const truffleBuildDir = "./build/contracts"
// const contractPath = `${truffleBuildDir}/${contractName}.json`
// const interf = require(contractPath)
// const accounts = eth.accounts
// const { abi, bytecode } = interf
//
// const contractAddressPath = "./data/contract-address.txt"
//
// if (!existsSync(contractAddressPath)) {
//   console.error("The contract is not deployed - deploy the contract first using `node deploy/deploy.js`")
//   process.exit(0)
// }
//
// const contractAddress = readFileSync(contractAddressPath).toString().trim()
//
// const privateKey = readFileSync(privateKeyFile).toString().trim()
// const account = accounts.privateKeyToAccount(privateKey)
// const address = account.address
// console.log("Address:", address)
//
// const SimpleStorage = new eth.Contract(abi, contractAddress).methods // contract class
//
//
// ;(async () => {
//
//   let value = await SimpleStorage.get().call()
//
//   console.log("Value read from contract:", value)
//
//   const newValue = 123
//
//   const gasPrice = '1' // gwei
//   const gasPriceWeis = web3.utils.toWei(gasPrice, 'gwei')
//
//   console.log("Creating a transaction to set a modify the contract value...")
//   const method = SimpleStorage.set(newValue)
//   const txData = method.encodeABI()
//   let gasCost = await method.estimateGas()
//   gasCost = gasCost + 13000 // TODO: recheck gas estimation, we shouldn't need to bump it
//
//   const txOptions = {
//     from:     address,
//     gas:      gasCost,
//     gasPrice: gasPriceWeis,
//     data:     txData,
//   }
//
//   // sign Transaction
//   const tx = await account.signTransaction(txOptions)
//   const txRaw = tx.rawTransaction
//
//   const resp = await eth.sendSignedTransaction(txRaw)
//   console.log("resp:", resp)
//
//   value = await SimpleStorage.get().call()
//
//   console.log("Value read from contract:", value)
//
// })()
