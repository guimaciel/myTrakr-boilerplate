import { returnTransactionOfType } from "./Transaction.js"
let accountsArray = [];

class Account {
  constructor(username,transaction) {
    this.username = username;
    this.transactions = transaction;
  }

  get balance() {
    return this.transactions.reduce((total, transaction) => {
      let trans = returnTransactionOfType(transaction);
      return total + trans.value;
    }, 0);
  }
}

// Get Accounts
export const getAccounts = function () {
    $.ajax({
      method: "get",
      url: "http://localhost:3000/accounts",
      dataType: "json",
    }).done((accArray) => {
      accountsArray = accArray;
      fillSelectAcct();
      fillAccountSummary();
    });

}

// Add New Account
export const addNewAccount = function () {
  let newAccount = new Account($('#newAccount').val(),[]);
  // Validate if input is not empty
  if (!newAccount.username) {
    alert("Insert account!");
    return;
  }
  // Validate if input username already exists
  const usernameArr = [];
  accountsArray.forEach((element) => {
    usernameArr.push(element.username);
  })
  if (usernameArr.includes(newAccount.username)) {
    alert("This account already exists!");
    return;
  }

  // Using Ajax, send the new account to be stored
  $.ajax({
    method: "post",
    data: JSON.stringify({ newAccount }),
    url: "http://localhost:3000/accounts",
    contentType: "application/json; charset=utf-8",
    traditional: true,
  }).done((data) => {
    accountsArray.push(data);
    fillSelectAcct(data);
    fillAccountSummary();
  });

}

export function getAccountById(id) {
  let newAccount = null;
  accountsArray.forEach((element) => {
    if (element.id == id) {
      newAccount = new Account(element.username, element.transactions);
    }
  });
  return newAccount;  
}

export function fillSelectAcct() {
  $('select.account').empty();
  $('#accountsFilter').append(`
      <option value="ALL">ALL</option>
    `);
  accountsArray.forEach((element) => {
    $('select.account').append(`
      <option value="${element.id}">${element.username}</option>
    `);
  });
}

export function fillAccountSummary() {
  $('#accountsSummary').empty();
  accountsArray.forEach((element) => {
    const acc = new Account(element.username,element.transactions);
    $('#accountsSummary').append(`
      <li>${acc.username}: ${acc.balance}</li>
    `);
  });
}

export default {getAccounts, addNewAccount, getAccountById, fillAccountSummary };