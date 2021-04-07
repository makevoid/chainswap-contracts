// #! /usr/bin/env node
//
// const fs = require('fs')
// const { promisify } = require('util')
// const Web3 = require('web3')
//
// const web3 = new Web3("https://node.cheapeth.org/rpc")
// const eth = web3.eth
//
// const privateKeyFile = "./.private-key2.txt"
//
// const contractName = "Chainswap"
// const truffleBuildDir = "../build/contracts"
// const contractPath = `${truffleBuildDir}/${contractName}.json`
// const interf = require(contractPath)
// const accounts = eth.accounts
//
// const privateKey = fs.readFileSync(privateKeyFile).toString().trim()
// const account = accounts.privateKeyToAccount(privateKey)
// const address = account.address
// console.log("Address:", address)
//
// const main = async () => {
//
//   const balance = await eth.getBalance(address)
//   console.log("Balance:", balance)
//
//   const { abi, bytecode } = interf
//
//   // new contract:
//   const Chainswap = new eth.Contract(abi, { from: address, data: bytecode }) // contract class
//
//   const ContractEstimateGas = promisify(Chainswap.deploy().estimateGas)
//   const ContractDeploy = Chainswap.deploy().encodeABI
//
//   const gasEst = await ContractEstimateGas()
//   console.log("Gas estimation:", gasEst)
//
//   const gasValue = gasEst
//   console.log("Deploying contract:", contractName)
//
//   const gasPrice = '1' // gwei
//
//   const gasPriceWeis = web3.utils.toWei(gasPrice, 'gwei')
//   console.log("Gas Price: ", gasPrice)
//
//   const deployTxData = ContractDeploy()
//
//   const txOptions = {
//     from:     address,
//     gas:      gasValue,
//     gasPrice: gasPriceWeis,
//     data:     deployTxData,
//   }
//
//   // sign Transaction
//   const tx = await account.signTransaction(txOptions)
//   const txRaw = tx.rawTransaction
//
//   const resp = await eth.sendSignedTransaction(txRaw)
//   const contractAddress = resp.contractAddress
//
//   fs.writeFileSync("data/contract-address.txt", contractAddress)
//
//   console.log(`Deployed Contract at address: ${contractAddress}`)
// }
//
// main()
//   .catch((err) => {
//     console.error(err)
//   })
