// SPDX-License-Identifier: UNLICENSED 
pragma solidity ^0.8.9;

contract Transactions {
  uint256 transactionCount;

  constructor (){
    transactionCount = 0;
  }

  event Transfer(address from, address receiver, uint amount, string message, uint256 timestamp, string keyword);

  struct TranferStruct{
    address sender;
    address receiver;
    uint amount;
    string message;
    uint256 timestamp;
    string keyword;
  }

  TranferStruct[] transactions;

  // payable: 'receiver' can recieve Ether
  // memory: variable store in memory and exists only during the execution of a function => can modify
  // calldata: variable is read only during the execution of a function => can not modify
  function addToBlockchain (address payable receiver, uint amount, string memory message, string memory keyword) public {
    transactionCount+=1;

    // msg (current account), block (current block): global variable
    TranferStruct memory newTransaction = TranferStruct(msg.sender, receiver, amount, message, block.timestamp, keyword);
    transactions.push(newTransaction);

    // return transaction hash when call emit Transfer
    emit Transfer(msg.sender, receiver, amount, message, block.timestamp, keyword);
  }

  function getAllTransactions() public view returns (TranferStruct[] memory){
    return transactions;
  }

  function getTransactionCount() public view returns (uint256){
    return transactionCount;
  }
}

