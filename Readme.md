# chainswap-contracts

Chainswap contracts for ERC777 based centralized non custodial (SGX) token transfers


### Assumption

- centralized model
- chainswap operator cannot access the private key
- the user can withdraw after x blocks

### Scenario

2 tokens, A and B - both on the same chain and ERC777 for simplicity

- User A has some tokens TokenA
- User B has some tokens TokenB
- Chainswap contract is deployed on that chain


### Main flow - token swap

- User A deposits some tokens (e.g. 10) TokenA in Chainswap
- User B deposits some tokens (e.g. 10) TokenB in Chainswap
- User A sends the Chainswap server a signed order message `buy|2|1.5` (buy order, buy 3 TokenB at price `1.5` TokenA/TokenB)
- User B sends the server the matching (signed) order - `sell|3|1.5`
- User A withdraws the swapped tokens (2 TokenB) from Chainswap to his/her address
- User B withdraws the swapped tokens (2 TokenA) from Chainswap to his/her address

### Withdrawal flow

There is a user controlled withdraw flow available in case the operator doesn't sign the transfer for reasons like inactivity (e.g. the platform is down), in case the SGX server is off or in case the SGX Admin ETH keys are lost.

- User A can call a withdrawal for his TokenA and TokenB tokens after a certain block (default value: 24h) meaning that every deposit, match and withdraw reset the withdrawal timer and the user will need to wait ~1 day to be able to withdraw his/her funds.


### Deploy contract

Execute the following command to deploy the sample contract

    npm run migrate


### Execute test suite

    npm test


---

hope this helps ;)

@makevoid
