// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "./IERC20.sol";


contract Chainswap {

    // sample - swap eth with renDoge and viceversa
    // two eth erc20 compliant tokens
    // wrapped ETH
    // (local dev: address 0)
    // address constant public TOKEN_A_ADDRESS = 0x41c64b7E41D78e043b70C6d56E334799b801ba01;
    // // renB
    // address constant public TOKEN_B_ADDRESS = 0x3832d2F059E55934220881F831bE501D180671A7;
    // ERC20 private tokenA; // production
    // IERC20 private tokenB;
    IERC20 public tokenA;
    IERC20 public tokenB;

    address constant public SGX_ADMIN_ADDRESS_A = 0xdBCd8a13AF0D49E40CE3AEd65f8F68519Fde3720;
    address constant public SGX_ADMIN_ADDRESS_B = 0x7D723ecD16752390EF0EfB4A81A2aF80F108519E;

    // signature Nonces
    mapping(address => uint112) public noncesA;
    mapping(address => uint112) public noncesB;

    uint16 private maxBlock = 800; // 20 hours worth of blocks

    // amount deposited
    // proof of withdrawal are the signed messages (verified)
    mapping(address => uint112) public depositA;
    mapping(address => uint112) public depositB;

    mapping(address => uint112) public withdrawalLastBlocks;

    // development-only
    event LogAddr(address value);
    event LogInt(uint256 value);
    event LogStr(string value);

    // production
    // constructor() public {
    // development - pass the addresses
    constructor(address tokenAAddress, address tokenBAddress) {
        // require(msg.sender == sgxAdminAddress, "onlyAdminCanDeployError"); // for production

        // development
        tokenA = IERC20(tokenAAddress);
        tokenB = IERC20(tokenBAddress);

        // production
        // tokenA = IERC20(TOKEN_A_ADDRESS);
        // tokenB = IERC20(TOKEN_B_ADDRESS);

        // development - b
        // tokenA = new ERC20("Wrapped Ether", "WETH");
        // tokenB = new ERC20("renDOGE", "renDOGE");
    }
    //

    // deposit is simply a transfer - can be automated with 2 ERC20 transactions - approve and transferfrom
    // in two different transactions / or by eth - also we need a payable in case of eth
    //
    function depositToken(bool isTokenA, uint amount, bytes32 signature, bytes32 signedMessage) public {
        // require amount to be > a certain treshold (min amount) and to not overflow
        // require(amount < 1000, "amountTooSmallError");
        IERC20 token;
        address sgxAdminAddress;
        if (isTokenA) {
            token = tokenA;
            sgxAdminAddress = SGX_ADMIN_ADDRESS_A;
        } else {
            token = tokenB;
            sgxAdminAddress = SGX_ADMIN_ADDRESS_B;
        }
        tokenA.transfer(sgxAdminAddress, amount);
    }
    //
    // withdraw functions - user callable functions for ERC777
    //
    // function withdrawTokenA(uint112 amount) public {
    //     tokenA.transferFrom(SGX_ADMIN_ADDRESS_A, msg.sender, amount);
    // }
    //
    // function withdrawTokenB(uint112 amount) public {
    //     tokenA.transferFrom(SGX_ADMIN_ADDRESS_B, msg.sender, amount);
    // }

    // WITHDRAW - from admin user
    //
    function withdrawToken(bool isTokenA, uint amount) public {
        // require amount to be < a certain treshold per call (min amount) and to not overflow
        // amount too big for singla transaction, use multiple transactions
        // require(amount < 1000, "amountTooBigError");
        //
        // rate limiting withdrawal - increase window where attacked user can withdraw
        // if the contract or the user is under attack
        // disable it by commenting this line and the _updateLastWithdrawal() call (to save gas)
        // TODO: finish writing blockLastWidthrawal
        // require("blockLastWidthrawal")

        IERC20 token;
        address sgxAdminAddress;
        if (isTokenA) {
            token = tokenA;
            sgxAdminAddress = SGX_ADMIN_ADDRESS_A;
        } else {
            token = tokenB;
            sgxAdminAddress = SGX_ADMIN_ADDRESS_B;
        }

        // only-admin-allowed - allow only admin a or b to call this function
        require(msg.sender == sgxAdminAddress, "onlyAdminAllowedError");

        // _updateLastWithdrawal(user);
        token.transfer(sgxAdminAddress, amount);
    }

    // update last withdrawal - rate limiting - can be disabled if maximum gas saving is the main target of the project
    // disabling/commenting this removes a user security feature
    function _updateLastWithdrawal(address userAAddress) public {
        withdrawalLastBlocks[userAAddress] = uint112(block.number);
    }

    // notes:
    // message format - side - amount - nonce - expiryBlock
    // const messageA = "buy|10|1|123"
    // const messageHashA = sha3(messageA)
    // const signatureA = await web3.eth.personal.sign(messageHashA, web3.eth.defaultAccount)
    //
    //
    // matchOrders - called on token order matching - admin only
    //
    function matchOrders(
        address userAAddress,
        address userBAddress,
        uint112 amountA,
        uint112 amountB,
        uint112 priceA,
        uint112 priceB,
        // bytes32 signatureA,
        // bytes32 signedMessageA,
        // bytes32 signatureB,
        // bytes32 signedMessageB,
        uint32 nonceA,
        uint32 nonceB,
        uint32 expiryBlockA,
        uint32 expiryBlockB
    ) public {
        // "buy|10|1|1234"
        bytes memory messageA = bytes(abi.encodePacked("buy", amountA, priceA, nonceA, expiryBlockA));
        bytes memory messageB = bytes(abi.encodePacked("buy", amountB, priceB, nonceB, expiryBlockB));
        require(expiryBlockA > block.number + maxBlock, "expiryBlockTooLowError");
        require(expiryBlockB > block.number + maxBlock, "expiryBlockTooLowError");
        require(nonceA > noncesA[msg.sender], "nonceTooLowError");
        require(nonceB > noncesB[msg.sender], "nonceTooLowError");
        // require(signedMessageA == messageA, "signedMessageASignatureError");

        tokenA.transferFrom(msg.sender, userAAddress, amountB);
        // tokenB.transferFrom(msg.sender, userBAddress, amountA);
    }

    function getBalance(string memory tokenAB, address addr) public view returns (uint256 balance) {
        bytes memory tokenBytes = bytes(tokenAB);
        bool isTokenA = tokenBytes[0] == bytes1("a");
        IERC20 token;
        if (isTokenA) {
            token = tokenA;
        } else {
            token = tokenB;
        }
        balance = token.balanceOf(addr);
        return balance;
    }

    // public function matchOrders() {
    // }

    // TODO: add timelock

    // struct Order {
    //   uint weight;
    //   bool voted;
    //   address delegate;
    //   uint vote;
    // }
    //
    // mapping(address => ) public balances;

    // address | side  | amount | price | created_at | sig
    // 0x1234  | buy   | 1      | 0.1   | x          |
    // 0x2345  | sell  | 0.5    | 0.1   | x          |

}
