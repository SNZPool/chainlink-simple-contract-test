# install
```
npm install
```

# file `.env`
please add the file `.env` in your project directory at first
```
# the file containing the contract abi, don't change it
ABI_PATH="./contracts/OffchainAggregator.json"

# the url to get the price value
PRICE_URL="https://api.propmarketcap.com/v1/properties/sg-sin-573968-sinminglane-20-0253/token_value"

# please change it to your blockchain rpc url
RPC_URL="https://goerli.infura.io/v3/<>"

# the feed contract address on your target chain
# here is a sample contract address on goerli testnet
CONTRACT_ADDR="0x1e23989885Db1463F3BB857f7c20992F7B4BC343"

# transmitter's private key
# please comfirm this address have been added in feed contract's "transmitter" and have enough gas
PRI_KEY=""

# transmitter's address that match the private key above
PUB_ADDR=""
```

# run
When you run the script, it will call PRICE_URL to get the value and update contract's answer once.
The current function is relatively simple. One run, one update. Sometimes, it will fail because RPC_URL connection is timeout.
We will improve it in next version. For exampe, add periodic triggering and threshold triggering.
```
npm start
```
