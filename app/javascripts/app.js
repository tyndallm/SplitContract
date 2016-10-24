var accounts;
var splitInstance;

function setStatus(message) {
  var status = document.getElementById("status");
  status.innerHTML = message;
};

function refreshValues() {
  console.log("refreshing balances... (please wait)")
  var beneficiaryA = web3.eth.getBalance(accounts[2], function(err, balance) {
    var beneficiaryABalance = web3.fromWei(balance.valueOf(), 'ether');
    var beneficaryA_element = document.getElementById("beneficiaryA_balance");
    console.log("Beneficiary A updated balance: ", beneficiaryABalance);
    beneficaryA_element.innerHTML = beneficiaryABalance;
  });

  var beneficiaryB = web3.eth.getBalance(accounts[3], function(err, balance) {
    var beneficiaryBBalance = web3.fromWei(balance.valueOf(), 'ether');
    var beneficaryB_element = document.getElementById("beneficiaryB_balance");
    console.log("Beneficiary B updated balance: ", beneficiaryBBalance);
    beneficaryB_element.innerHTML = beneficiaryBBalance;
  });

  var contractAddr = web3.eth.getBalance(splitInstance.address, function(err, balance) {
    var contractBalance = web3.fromWei(balance.valueOf(), 'ether');
    var contract_element = document.getElementById("contract_balance");
    console.log("Contract updated balance: ", contractBalance);
    contract_element.innerHTML = contractBalance;
  });

  splitInstance.totalDeposited.call().then(function(num) {
    var totalDeposited = web3.fromWei(num.valueOf(), 'ether');
    var totalDeposited_element = document.getElementById("total_deposited");
    totalDeposited_element.innerHTML = totalDeposited;
  });

  splitInstance.numOfDeposits.call().then(function(num) {
    var numOfDeposits_element = document.getElementById("num_of_deposits");
    numOfDeposits_element.innerHTML = num;
  });

};

function sendWei() {
  var amount = parseInt(document.getElementById("amount").value);
  var sender = String(document.getElementById("sender").value);
  setStatus("Initiating transaction... (please wait)");
  splitInstance.sendWei({ from: sender, value: amount}).then(function(result) {
    setStatus("Wei sent: " + result);
    refreshValues();
  }).catch(function(e) {
    console.log(e);
    setStatus("Error sending wei;");
  })
}

window.onload = function() {
  web3.eth.getAccounts(function(err, accts) {
    if (err != null) {
      alert("There was an error fetching your accounts.");
      return;
    }

    if (accts.length == 0) {
      alert("Couldn't get any accounts! Is your Ethereum client configured correctly?");
      return;
    }

    web3.eth.getBalance(accts[0], function(err, balance) {
      console.log("owner balance: ", web3.fromWei(balance).toNumber());
      setupContract(accts);
    });
  });

  function setupContract(accts) {
    console.log("Setting up contract... (please wait)");
    Split.new(accts[2], accts[3], {from: accts[0], gas: 300000}).then(
      function(split) { 
        console.log("Contract initialized");
        console.log("acct[1]: ", accts[1]);
        console.log("send amount: 1000000000000000000");
        splitInstance = split; 
        accounts = accts;
        refreshValues();
      }
    );
  }
}
