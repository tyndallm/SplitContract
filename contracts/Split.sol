pragma solidity ^0.4.2;

contract Split {

  address public beneficiaryA;
  address public beneficiaryB;
  uint public totalDeposited;
  uint public numOfDeposits; 
  address public owner;

  event Deposit(address from, uint value);

  function Split(address accountA, address accountB) payable {
    owner = msg.sender;
    totalDeposited = 0;
    numOfDeposits = 0;
    // TODO make a check to see that beneficiary addresses are passed in!!!
    beneficiaryA = accountA;
    beneficiaryB = accountB;
  }

  // in the latest version of Solidity if a function accepts ether 
  // and does not have this modifier it will throw
  function sendWei() payable returns (bool) {
    Deposit(msg.sender, msg.value);

    var splitAmount = msg.value / 2;

    // If either of these transactions fail we want to rollback
    var firstSendResult = address(beneficiaryA).send(splitAmount);
    var secondSendResult = address(beneficiaryB).send(splitAmount);
    
    if (firstSendResult && secondSendResult) {
      totalDeposited += msg.value;
      numOfDeposits++;
      return true;
    } else {
      throw;
    }
    return beneficiaryA.send(msg.value);
  }

  function destroy() returns (bool) {
    if (msg.sender == owner) {
      suicide(owner);
      return true;
    }
  }
}