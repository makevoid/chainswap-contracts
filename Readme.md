# cheapeth-truffle-config

Sample repositories of a truffle config deployed on cheapETH network (1 tx costs ~1p so you can develop on main chain)


### Prepare private key file

Create a file named `.private-key.txt` in this directory, get your account private key (you should have some funds on it, 1 cTH is more than enough) and save it into the file.

NOTE: to export your private key from metamask, open it, click the three vertical dots button, select "Account Details" and "Export Private Key".

### Deploy contract

Execute the following command to deploy the sample contract

    npm run migrate


### Call contract

    npm start
