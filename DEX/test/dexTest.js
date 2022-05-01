const Dex = artifacts.require("Dex") 
const Link = artifacts.require("Link")
const truffleAssert  = require('truffle-assertions');
contract("Dex", accounts =>{
   
//The user nust have ETH deposited such that deposited eth >= buy order value
it ("Should have enough eth to pay for the buy order value",async() =>{
    let dex = await Dex.deployed();
    let link = await Link.deployed();
    let price = 10;
    let tokenVolume = 100;
    await truffleAssert.reverts(dex.createlimitBUYOrder(price, web3.utils.fromUtf8("LINK"),tokenVolume));
    dex.deposit()

})
//The user must have enough tokens deposited such that token balance >=sell order amount
it ("Should have enough tokens in wallet to provide for the sell order amount",async() =>{
    let dex = await Dex.deployed();
    let link = await Link.deployed();
    let price = 10;
    let tokenVolume = 100;
    truffleAssert.reverts(dex.createlimitSELLOrder(price, web3.utils.fromUtf8("LINK"), tokenVolume));

})

//The BUY order book should be ordered on price from highest to lowest starting at index 0
it ("The BUY order book should be ordered on price from highest to lowest starting at index 0",async() =>{
    let dex = await Dex.deployed();
    let link = await Link.deployed();
    await dex.createlimitSBUYOrder(100, web3.utils.fromUtf8("LINK"),1000);
    await dex.createlimitSBUYOrder(50, web3.utils.fromUtf8("LINK"),2000);
    await dex.createlimitSBUYOrder(75, web3.utils.fromUtf8("LINK"),1500);

    let orderBook = await dex.etOrderBook( web3.utils.fromUtf8("LINK"),0);

    const lastOrder =  orderBook[0];
    for(let i =0; i < orderBook.lengh ;i++){
        assert(orderBook[i+1].price <=orderBook[i].price);
    }

})

//The user must be credited the token purchased in a BUY market order 
//The user ETH balance must be debited from the value for a BUY market order 
it ("Should receive the tokens purchased in wallet",async() =>{
    let dex = await Dex.deployed();
    let link = await Link.deployed();
    let price = 10;
    let tokenVolume = 100;
    await dex.depositEth({value:10});
    await dex.createMarketBUYOrder(price, web3.utils.fromUtf8("LINK"),tokenVolume);
    assert.equal(dex.balances[msg.sender][web3.utils.fromUtf8("LINK")],tokenVolume);
})
//The user must be debited the token sold in a SELL market order
//The user ETH balance must be credited from the value for a SELL market order 
it ("Should deduct the token amount of a sell order ",async() =>{
    let dex = await Dex.deployed();
    let link = await Link.deployed();
    let price = 10;
    let tokenVolume = 100;

    await dex.createMarketSELLOrder(price, web3.utils.fromUtf8("LINK"),tokenVolume);
    assert.equal(dex.balances[msg.sender][web3.utils.fromUtf8("LINK")],tokenVolume);
    assert.equal(msg.sender.balances,price)
})

})

