import { getAccountById, fillAccountSummary } from "./Account.js";

class Transaction {
  constructor(amount, account) {
    this.amount = amount;
    this.account = account;
  }
  commit() {
    if (this.value < 0 && this.amount > this.account.balance) return;
    this.account.transactions.push(this.value);
  }
}

class Withdrawal extends Transaction {
  get value() {
    return -this.amount;
  }
}

class Deposit extends Transaction {
  get value() {
    return this.amount;
  }
}

class Transfer extends Transaction {
  constructor(amount,accountId,accountIdFrom,accountIdTo) {
    super(amount,accountId);
    this.accountIdFrom = accountIdFrom;
    this.accountIdTo = accountIdTo;
  }
  get value() {
    if (this.account == this.accountIdFrom) {
      return -this.amount;
    } else if (this.account == this.accountIdTo) {
      return this.amount;
    }
  }
}

let transactionArray = [];

export const getTransaction = function () {
  $.ajax({
    method: "get",
    url: "http://localhost:3000/transactions",
    dataType: "json",
  }).done((data) => {
    transactionArray = data;
    if (transactionArray.length > 0) {
      transactionArray.forEach((elementAr) => {
        elementAr.forEach((element) => {
          addTransactionTable(element);
        });        
      });
    }
  });
};

export const addNewTransaction = function () {
  const transacType = $('.transactionType:checked').val();
  let accountId, accountIdFrom, accountIdTo;
  let trans;
  switch (transacType) {
    case "transfer":
      accountId = null;
      accountIdFrom = $('#accountFrom').val();
      accountIdTo = $('#accountTo').val();
      trans = new Transfer(parseInt($('#amount').val()),accountId,accountIdFrom,accountIdTo);
      break;
    case "withdraw":
      accountIdFrom = accountIdTo = null;
      accountId = $('#accountSelect').val();
      trans = new Withdrawal(parseInt($('#amount').val()),accountId)
      break;
    case "deposit":
      accountIdFrom = accountIdTo = null;
      accountId = $('#accountSelect').val();
      trans = new Deposit(parseInt($('#amount').val()),accountId)
  }
  const category = $('#category').val();
  const description = $('#description').val();
  const amount = parseInt($('#amount').val());

  const newTransaction = {
    accountId: accountId,
    accountIdFrom: accountIdFrom,
    accountIdTo: accountIdTo,
    amount: amount,
    type: transacType,
    description: description,
    category: category,
  }

  // Using Ajax, send the new transaction to be stored.
  $.ajax({
    method: "post",
    data: JSON.stringify({ newTransaction }),
    url: 'http://localhost:3000/transaction',
    contentType: "application/json; charset=utf-8",
    traditional: true,
  }).done((data) => {
    data.forEach((element) => {
      // If successfuly stored, add the new transaction to the list for the specific account
      let account = getAccountById(element.accountId);
      account.transactions.push(element);

      // Update account balance in the Account Summary section
      fillAccountSummary();

      // Add new transaction to transaction table's list
      addTransactionTable(element);
    })
      

  });

    


};

export function returnTransactionOfType(transaction) {
  switch (transaction.type) {
    case "withdraw":
      return new Withdrawal(transaction.amount,transaction.accountId);
    case "deposit":
      return new Deposit(transaction.amount,transaction.accountId);
    case "transfer":
      return new Transfer(transaction.amount,transaction.accountId,transaction.accountIdFrom, transaction.accountIdTo);
  }
}

function addTransactionTable(transaction) {
  let acc = getAccountById(transaction.accountId);
  let trans = returnTransactionOfType(transaction);
  let acc2 = getAccountById(transaction.accountIdFrom);
  let accountIdFrom, accountIdTo;
  if (acc2) accountIdFrom = acc2.username;
  acc2 = getAccountById(transaction.accountIdTo);
  if (acc2) accountIdTo = acc2.username;
  let amount = transaction.amount;
  // if (transaction.amount < 0) amount = transaction.amount * -1;
  $(".transactionsTable").append($(`<tr class='account-${transaction.accountId} account-list'>`)
    .append($("<td>").append(transaction.id))
    .append($("<td>").append(acc.username))
    .append($("<td>").append(transaction.type))
    .append($("<td>").append(transaction.category))
    .append($("<td>").append(transaction.description))
    .append($("<td>").append(trans.value))
    .append($("<td>").append(accountIdFrom))
    .append($("<td>").append(accountIdTo))
  );

}

function convertTransactionType(transaction) {

}

export function validateTransaction() {
  // Transaction amount should be greater than 0.
  if ($('#amount').val() == null || $('#amount').val() <= 0) {
    alert("Insert amount valid value!");
    return false;
  }

  // Category is required
  if ($('#category').val() == "" || $('#category').val() == "new") {
    alert("Choose  valid category!");
    return false;
  }

  // Account is required
  // If transfer is selected, from and to are required and shouldn't be the same account for both.
  // If transaction is transfer or withdrawal, check if current balance is enough.
  const transacType = $('.transactionType:checked').val();
  let acc;
  let trans;
  switch (transacType) {
    case "transfer":
      acc = getAccountById($('#accountFrom').val());
      if ($('#accountFrom').val() == null || $('#accountTo').val() == null) {
        alert("Select all accounts!")
        return false;
      }
      if ($('#accountFrom').val() == $('#accountTo').val()) {
        alert("Accounts should be different!");
        return false;
      }
      if (acc.balance < parseFloat($('#amount').val())) {
        alert("Balance is not enough for transaction!");
        return false;
      }
      break;
    case "withdraw":
      acc = getAccountById($('#accountSelect').val());
      // console.log(acc);
      if (acc.balance < parseFloat($('#amount').val())) {
        alert("Balance is not enough for transaction!");
        return false;
      }
    default:
      if ($('#accountSelect').val() == null) {
        alert("Select all accounts!")
        return false;
      }
  }

  return true;
}

export default { getTransaction, addNewTransaction, validateTransaction, returnTransactionOfType };
