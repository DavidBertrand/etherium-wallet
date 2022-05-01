const Dex = artifacts.require("Dex") 
const Link = artifacts.require("Link")
const truffleAssert  = require('truffle-assertions');
contract("Dex", accounts =>{
    it ("should only be possible for owner to add tokens",async() =>{
        let dex = await Dex.deployed();
        let link = await Link.deployed();
        await truffleAssert.passes(
            dex.addToken(web3.utils.fromUtf8("LINK"), link.address, {from: accounts[0]})
        )
        await truffleAssert.reverts(
            dex.addToken(web3.utils.fromUtf8("AAVE"), link.address, {from: accounts[1]})
        )
    })

    it ("should handle deposit correctly",async() =>{
        let dex = await Dex.deployed();
        let link = await Link.deployed();
        await link.approve(dex.address, 500);
        await dex.deposit(100, web3.utils.fromUtf8("LINK"));
        let balance = await dex.balances(accounts[0],web3.utils.fromUtf8("LINK"));
        assert.equal(balance.toNumber(), 100)

    })

    it ("should handle faulty withdrawals correctly",async() =>{
        let dex = await Dex.deployed();
        let link = await Link.deployed();

        await truffleAssert.reverts(dex.withdraw(500, web3.utils.fromUtf8("LINK")));

    })

    it ("should handle correct withdrawals correctly",async() =>{
        let dex = await Dex.deployed();
        let link = await Link.deployed();

        await truffleAssert.passes(dex.withdraw(100, web3.utils.fromUtf8("LINK")));

    })

//The user nust have ETH deposited such that deposited eth >= buy order value
it ("The user nust have ETH deposited such that deposite eth >= buy order value",async() =>{
    let dex = await Dex.deployed();
    let link = await Link.deployed();
    let price = await accounts[0].balance + 100;
    let tokenVolume = 100;
    truffleAssert.reverts(await dex.createlimitBUYOrder(price, web3.utils.fromUtf8("LINK"),tokenVolume));

})
//The user must have enough tokens deposited such that token balance >=sell order amount
it ("The user must have enough tokens deposited such that token balance >=sell order amount",async() =>{
    let dex = await Dex.deployed();
    let link = await Link.deployed();
    let price = 100;
    let tokenVolume = await balances(accounts[0], web3.utils.fromUtf8("LINK")) + 100;
    truffleAssert.reverts(await dex.createlimitSELLOrder(toSend, web3.utils.fromUtf8("LINK")));

})
//The BUY order book should be ordered on price from highest to lowest starting at index 0
it ("The BUY order book should be ordered on price from highest to lowest starting at index 0",async() =>{
    let dex = await Dex.deployed();
    let link = await Link.deployed();
    await dex.createlimitSBUYOrder(100, web3.utils.fromUtf8("LINK"),1000);
    await dex.createlimitSBUYOrder(50, web3.utils.fromUtf8("LINK"),2000);
    await dex.createlimitSBUYOrder(75, web3.utils.fromUtf8("LINK"),1500);
    let = await getOrderBook(web3.utils.fromUtf8("LINK"),0);
 
    truffleAssert.reverts(await dex.createlimitSELLOrder(toSend, web3.utils.fromUtf8("LINK")));

})

//The BUY order book should be ordered on price from highest to lowest starting at index 0
}