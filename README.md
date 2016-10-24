<snippet>
  <content><![CDATA[
# ${1:Project Name}
Ethereum Split contract and corresponding Truffle web app. 

This contract allows users to send a designated amount of way which then gets equally split amongst two beneficiary accounts.
- two main external beneficiary accounts
- splits deposited amount and sends split amount to both accounts;
- allows users to see the number of deposits that have been made
- allows users to see the total amount deposited to the contract

## Installation
1. Truffle compile
2. Truffle migrate
3. Truffle build

## Prerequisites
Requires 4 existing accounts to exist with existing balance on sender account
account[0] - Contract owner
account[2] - Beneficary A
account[3] - Beneficiary B
account[?] - The user's sender account

## Usage
Open index.html file created in /build directory to view interactive web page

]]></content>
  <tabTrigger>readme</tabTrigger>
</snippet>