const TokenA = artifacts.require("TokenA")
const TokenB = artifacts.require("TokenB")
const Chainswap = artifacts.require("Chainswap")

const SGX_ADMIN_ADDRESS_A = "0xdBCd8a13AF0D49E40CE3AEd65f8F68519Fde3720"
// const SGX_ADMIN_ADDRESS_B = "0x7D723ecD16752390EF0EfB4A81A2aF80F108519E"

// const USER_A_ADDRESS = "0x41c64b7E41D78e043b70C6d56E334799b801ba01"
const USER_B_ADDRESS = "0xeE16e0398Fb886Fb22190bA7102a5Bd13E80Da90"

const txArgsAdminA = {
  from: SGX_ADMIN_ADDRESS_A,
}

const txArgsB = {
  from: USER_B_ADDRESS,
}

const deployments = async (deployer, _, accounts) => {
  console.log("address A:", accounts[0])
  console.log("address B:", accounts[1])
  await deployer.deploy(TokenA)
  await deployer.deploy(TokenB, txArgsB)
  const tokenAAddress = TokenA.address
  const tokenBAddress = TokenB.address
  console.log("Token A address:", tokenAAddress)
  console.log("Token B address:", tokenBAddress)
  await deployer.deploy(Chainswap, tokenAAddress, tokenBAddress, txArgsAdminA)
}

module.exports = deployments
