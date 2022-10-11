var fs = require('fs');
var https = require('node:https');
var Web3 = require("web3");
var ethers = require('ethers');


// read .env
var dotenv = require("dotenv")
var result = dotenv.config()
if (result.error) {
    throw result.error
}

const RPC_URL = process.env.RPC_URL
const PRI_KEY = process.env.PRI_KEY
const PUB_ADDR = process.env.PUB_ADDR
const ABI_PATH = process.env.ABI_PATH
const RPICE_URL = process.env.PRICE_URL
const CONTRACT_ADDR = process.env.CONTRACT_ADDR

var data = fs.readFileSync(ABI_PATH,"utf-8");
var parsed = JSON.parse(data);
var abi = parsed.abi;

var web3 = new Web3();
web3.setProvider(new Web3.providers.HttpProvider(RPC_URL));
web3.eth.accounts.wallet.add(PRI_KEY)
var contract = new web3.eth.Contract(abi, PUB_ADDR);

const requestPrice = url => {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            res.on('data', (d) => {
                const obj = JSON.parse(d);
                var amountStr = obj.token_value_usd.toString();
                console.log("get valude: " + amountStr);
                resolve(amountStr);
            }).on('error', (e) => {
                console.error(e);
            });
        });
    });
}

requestPrice(RPICE_URL)
.then(function(amountStr){
    contract.methods.description().call()
        .then((msg) => {console.log("updating the feed " + msg)});
    return amountStr
})
.then(function(amountStr){
    contract.methods.latestAnswer().call()
        .then((msg) => {console.log("old value is " + msg)}); 
    return amountStr
})
.then(function(amountStr){
    contract.methods.transmit(ethers.utils.parseUnits(amountStr, 18))
        .send({
            from: '0x1e23989885Db1463F3BB857f7c20992F7B4BC343',
            gasLimit: 80000
        })
        .on('receipt', function(receipt){
            contract.methods.latestAnswer().call()
                .then((msg) => {console.log("new value is " + msg)});
        })
        .on('error', (e) => {
            console.error(e);
        });
});