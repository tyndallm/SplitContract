contract('Split', function(accounts) {
  console.log(accounts);
  console.log("==========balances==========");
  var owner_account = accounts[0];
  console.log("owner: ", web3.fromWei(web3.eth.getBalance(owner_account).toNumber()));
  var accountA = accounts[2];
  console.log("accountA: ", web3.fromWei(web3.eth.getBalance(accountA).toNumber()));
  var accountB = accounts[3];
  console.log("accountB: ", web3.fromWei(web3.eth.getBalance(accountB).toNumber()));
  var callerAccount = accounts[1];
  console.log("caller: ", web3.fromWei(web3.eth.getBalance(callerAccount).toNumber()));
  console.log("============================")

  it("Initial Split settings should match", function(done) {
    Split.new(accountA, accountB, {from: owner_account}).then(
      function(split) {
        split.numOfDeposits.call().then(
          function(num) {
            assert.equal(num, 0, "Number of deposits doesn't match");
        }).then(
          function() {
            return split.totalDeposited.call();
        }).then(
          function(num) {
            assert.equal(num, 0, "Total deposited amount doesn't match");
            return split.beneficiaryA.call();
        }).then(
          function(addr) {
            assert.equal(addr, accountA, "Beneficiary accountA does not match!");
            return split.beneficiaryB.call();
        }).then(
          function(addr) {
            assert.equal(addr, accountB, "Beneficiary accountB does not match!")
            done();
        }).catch(done);
    });
  });

  it("Should let you send wei", function(done) {
    Split.new(accountA, accountB, {from: owner_account}).then(
      function(split) {

        var sendAmount = 1000000000000000000;
        var initialBalanceBeneficiaryA = web3.eth.getBalance(accountA).toNumber();
        var initialBalanceBeneficiaryB = web3.eth.getBalance(accountB).toNumber();

          var contractBalance = web3.fromWei(web3.eth.getBalance(split.address).toNumber());
          console.log("contract: ", contractBalance);


        split.sendWei({from: accounts[1], value: sendAmount}).then(
          function(result) {
            console.log("owner: ", web3.fromWei(web3.eth.getBalance(owner_account).toNumber()));
            console.log("accountA: ", web3.fromWei(web3.eth.getBalance(accountA).toNumber()));
            console.log("accountB: ", web3.fromWei(web3.eth.getBalance(accountB).toNumber()));
            console.log("caller: ", web3.fromWei(web3.eth.getBalance(callerAccount).toNumber()));
            console.log("contract: ", web3.fromWei(web3.eth.getBalance(split.address).toNumber()));

            var newBalanceBeneficiaryA = web3.eth.getBalance(accountA).toNumber();
            var beneficiaryADifference = newBalanceBeneficiaryA - initialBalanceBeneficiaryA;

            var newBalanceBeneficiaryB = web3.eth.getBalance(accountB).toNumber();
            var beneficiaryBDifference = newBalanceBeneficiaryB - initialBalanceBeneficiaryB;

            var difference = beneficiaryADifference + beneficiaryBDifference;

            assert.equal(difference, sendAmount, "Difference should match what was sent");
            return split.numOfDeposits.call();
        }).then(
          function(num) {
            assert.equal(num, 1, "Number of deposits should match");
            console.log(num);
            return split.totalDeposited.call();
        }).then(
          function(total) {
            console.log(total);
            assert.equal(total, sendAmount, "Total deposited should match sendAmount!");
            done();
          }).catch(done);
      })
  });
});