const Chainswap = artifacts.require("Chainswap")
const TokenA = artifacts.require("TokenA")
const TokenB = artifacts.require("TokenB")
const { utils } = web3 // truffle injects web3 automagically
const { toBN } = utils

let tokenA
let tokenB
let cswap

const SGX_ADMIN_ADDRESS_A = "0xdBCd8a13AF0D49E40CE3AEd65f8F68519Fde3720"
const SGX_ADMIN_ADDRESS_B = "0x7D723ecD16752390EF0EfB4A81A2aF80F108519E"

const USER_A_ADDRESS = "0x41c64b7E41D78e043b70C6d56E334799b801ba01"
const USER_B_ADDRESS = "0xeE16e0398Fb886Fb22190bA7102a5Bd13E80Da90"

const txArgsAdminA = {
  from: SGX_ADMIN_ADDRESS_A,
}

const txArgsAdminB = {
  from: SGX_ADMIN_ADDRESS_B,
}

const txArgsB = {
  from: USER_B_ADDRESS,
}

// test utils - todo extract
const contractCallLastEvent = ({ callResult }) => {
  const { logs } = callResult
  const log = logs[0]
  const { event, args } = log
  return { event, args }
}

contract("Chainswap", async accounts => {
  it("setup - contract deployments", async () => {
    tokenA = await TokenA.deployed()
    tokenB = await TokenB.deployed()
    cswap = await Chainswap.deployed()
  })

  // it("setup - production - erc20 contracts targeted", async () => {
  //   const tokenA = await ERC20.deployed()
  //   const tokenB = await ERC20.deployed()
    // test for production
    // const tokenAAddress = tokenA.address
    // const tokenBAddress = tokenB.address
    // assert.equal(tokenAAddress, "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2")
    // assert.equal(tokenBAddress, "0xD02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2")
    // const tokenAAddress = await cswap.TOKEN_A_ADDRESS.call()
    // assert.equal(tokenAAddress.valueOf(), "0x41c64b7E41D78e043b70C6d56E334799b801ba01")
    // const tokenBAddress = await cswap.TOKEN_B_ADDRESS.call()
    // assert.equal(tokenBAddress.valueOf(), "0x3832d2F059E55934220881F831bE501D180671A7")
  // })

  it("setup - contract constants check", async () => {
    const sgxAdminAddressA = await cswap.SGX_ADMIN_ADDRESS_A.call()
    assert.equal(sgxAdminAddressA.valueOf(), SGX_ADMIN_ADDRESS_A)
    const sgxAdminAddressB = await cswap.SGX_ADMIN_ADDRESS_B.call()
    assert.equal(sgxAdminAddressB.valueOf(), SGX_ADMIN_ADDRESS_B)
  })

  it("setup - balances check - ERC20", async () => {
    const balanceA = await tokenA.balanceOf.call(USER_A_ADDRESS)
    assert.equal(balanceA.valueOf(), 1000000000)
    const balanceB = await tokenB.balanceOf.call(USER_B_ADDRESS)
    assert.equal(balanceB.valueOf(), 1000000001)
  })

  it("setup - balances check", async () => {
    // user A has token a balance, user B has token B balance
    const balanceAA = await cswap.getBalance.call("a", USER_A_ADDRESS)
    assert.equal(balanceAA.valueOf(), 1000000000)
    const balanceAB = await cswap.getBalance.call("a", USER_B_ADDRESS)
    assert.equal(balanceAB.valueOf(), 0)
    const balanceBA = await cswap.getBalance.call("b", USER_A_ADDRESS)
    assert.equal(balanceBA.valueOf(), 0)
    const balanceBB = await cswap.getBalance.call("b", USER_B_ADDRESS)
    assert.equal(balanceBB.valueOf(), 1000000001)
  })

  it("setup - fund chainswap account A", async () => {
    const sgxAdminAddress = SGX_ADMIN_ADDRESS_A
    const transferCall = await tokenA.transfer.call(sgxAdminAddress, 10)
    assert.equal(transferCall.valueOf(), true)
    const transfer = await tokenA.transfer(sgxAdminAddress, 10)
    const { logs } = transfer
    const log = transfer.logs[0]
    const { event, args } = log
    // console.log({ event, args }) // use this to debug Transfer event's event arguments
    const { from, to, value } = args
    assert.equal(from, USER_A_ADDRESS)
    assert.equal(to, sgxAdminAddress)
    assert.equal(value.valueOf(), 10)
  })

  it("setup - fund chainswap account B", async () => {
    const sgxAdminAddress = SGX_ADMIN_ADDRESS_B
    const transferCall = await tokenB.transfer.call(sgxAdminAddress, 10, txArgsB)
    assert.equal(transferCall.valueOf(), true)
    const transfer = await tokenB.transfer(sgxAdminAddress, 10, txArgsB)
    const { logs } = transfer
    const log = transfer.logs[0]
    const { event, args } = log
    const { from, to, value } = args
    assert.equal(from, USER_B_ADDRESS)
    assert.equal(to, sgxAdminAddress)
    assert.equal(value.valueOf(), 10)
  })

  it("withdraw A - call ERC20 transfer back - from sgx admin", async () => {
    const userAddress = USER_A_ADDRESS
    const transferCall = await tokenA.transfer.call(userAddress, 5, txArgsAdminA)
    assert.equal(transferCall.valueOf(), true)
    const transfer = await tokenA.transfer(userAddress, 5, txArgsAdminA)
    const { args } = contractCallLastEvent({ callResult: transfer })
    const { from, to, value } = args
    assert.equal(from, SGX_ADMIN_ADDRESS_A, "from address should match sgx admin address (A)")
    assert.equal(to, userAddress)
    assert.equal(value.valueOf(), 5)
  })

  it("withdraw B - call ERC20 transfer back - from sgx admin", async () => {
    const userAddress = USER_B_ADDRESS
    const transferCall = await tokenB.transfer.call(userAddress, 5, txArgsAdminB)
    assert.equal(transferCall.valueOf(), true)
    const transfer = await tokenB.transfer(userAddress, 5, txArgsAdminB)
    const { args } = contractCallLastEvent({ callResult: transfer })
    const { from, to, value } = args
    assert.equal(from, SGX_ADMIN_ADDRESS_B, "from address should match sgx admin address (B)")
    assert.equal(to, userAddress)
    assert.equal(value.valueOf(), 5)
  })

  it("check sgx admins balances", async () => {
    const balanceA = await cswap.getBalance.call("a", USER_A_ADDRESS)
    const balanceB = await cswap.getBalance.call("b", USER_B_ADDRESS)
    const balanceAdminA = await cswap.getBalance.call("a", SGX_ADMIN_ADDRESS_A)
    const balanceAdminB = await cswap.getBalance.call("b", SGX_ADMIN_ADDRESS_B)

    assert.equal(balanceA.valueOf(), 1000000000 - 5)
    assert.equal(balanceB.valueOf(), 1000000001 - 5)
    assert.equal(balanceAdminA.valueOf(), 5)
    assert.equal(balanceAdminB.valueOf(), 5)
  })

  it("adminA - matches orders - call", async () => {
    const block = await web3.eth.getBlockNumber()

    const userAAddress = USER_A_ADDRESS
    const userBAddress = USER_B_ADDRESS
    const amountA = 2
    const amountB = 3
    const priceA = 150 // 1.5
    const priceB = 150 // 1.5
    const nonceA = 1
    const nonceB = 2
    const expiryBlockA = block + 810 // 10 blocks more than `maxBlock` (800)
    const expiryBlockB = block + 810

    console.log({
      userAAddress,
      userBAddress,
      amountA,
      amountB,
      priceA,
      priceB,
      nonceA,
      nonceB,
      expiryBlockA,
      expiryBlockB
    })

    const matchCall = await cswap.matchOrders.call(
      userAAddress,
      userBAddress,
      amountA,
      amountB,
      priceA,
      priceB,
      nonceA,
      nonceB,
      expiryBlockA,
      expiryBlockB
    )
    console.log("matchCall:")
    console.log(matchCall)
  })

  // it("adminA - matches orders - send tx", async () => {
  //
  // })


  // it("depositToken deposit - call", async () => {
  //   const signature = "0x0000000000000000000000000000000000000000000000000000000000000062"
  //   const signedMessage = "0x0000000000000000000000000000000000000000000000000000000000000063"
  //   const depositTokenCall = await cswap.depositToken.call(true, toBN(1), signature, signedMessage)
  //   const depositTokenTx = await cswap.depositToken(true, toBN(1), signature, signedMessage)
  //   console.log(depositTokenTx)
  //   assert.equal(depositTokenCall.valueOf(), {})
  // })

  // it("depositToken deposit - sendTX", async () => {
  //   const signature = "0x0000000000000000000000000000000000000000000000000000000000000062"
  //   const signedMessage = "0x0000000000000000000000000000000000000000000000000000000000000063"
  //   const depositToken = cswap.depositToken.call(true, 1, signature, signedMessage)
  //   assert.equal(depositToken.valueOf(), 0)
  // })

  // it("deploys222", async () => {
  //   const USER_A_ADDRESS = "0xdBCd8a13AF0D49E40CE3AEd65f8F68519Fde3720"
  //   const USER_B_ADDRESS = "0x7D723ecD16752390EF0EfB4A81A2aF80F108519E"
  //
  //   const transferTokenCall = await cswap.transferToken.call(USER_A_ADDRESS, USER_B_ADDRESS, 10, 10, 2, 2, 1, 1, 1000, 1000)
  //   assert.equal(transferTokenCall.valueOf(), "0123")
  // })

})
