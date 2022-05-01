pragma solidity >=0.6.0 <0.8.0;
pragma experimental ABIEncoderV2;

import "./Wallet.sol";

contract Dex is Wallet{
    enum Side{
        BUY,
        SELL
    }

    struct Order{
        uint id;
        address trader;
        bool buyorder;
        bytes32 ticker;
        uint amount;
        uint price;
    }

    mapping (bytes32 => mapping (uint => Order[])) public orderBook; //ASSET MAPS TO ENUM BUY/SELL POINTING TO AN ORDER
    function getOrderBook(bytes32 ticker, Side side) view public returns (Order[]memory){
        return orderBook[ticker][uint(side)];
    }
    function createLimitBUYOrder(uint amount,bytes32 ticker, uint volume)public{

    }
    function createMarketBUYOrder(uint amount,bytes32 ticker, uint volume))public{

    }
    function createLimitSELLOrder(uint amount,bytes32 ticker, uint volume))public{

    }
    function createMarketSELLOrder(uint amount,bytes32 ticker, uint volume))public{

    }
}