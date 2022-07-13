import { getAccounts, addNewAccount } from "./helpers/Account.js";
import { addNewCategory, getCategories } from "./helpers/Category.js";
import { getTransaction, addNewTransaction, validateTransaction } from "./helpers/Transaction.js";

$(() => {
  //Start coding here!
  $('#divAccountSingle').hide();
  $('#divAccountTransfer').hide();
  $('.newCategory').hide();

  getAccounts();
  getCategories();
  getTransaction();
  
  // // Add New Account
  $('#addNewAccount').submit((e) => {
    e.preventDefault();
    addNewAccount();
  });

  // Change Transaction Type (Hide/Show account)
  $('.transactionType').change((e) => {
    const trOpt = $('.transactionType:checked').val();
    switch (trOpt) {
      case "transfer":
        $('#divAccountSingle').hide();
        $('#divAccountTransfer').show();
        break;
      default:
        $('#divAccountSingle').show();
        $('#divAccountTransfer').hide();
    }
    
  });

  // Hide/Show Add New Category
  $('#category').change((e) => {
    $('.newCategory').hide();
    if ($('#category').val() === "new") {
      $('.newCategory').show();
    }
  });

  // // Create event listener for click on 'Add new category' button
  $('#newCategoryBtn').click((e) => {
    e.preventDefault();
    addNewCategory();
  })

  // Add event listener for submitting transaction form
  $('#addTransaction').submit((e) => {
    e.preventDefault();
    if (validateTransaction()) {
      addNewTransaction();
    }
    
  });

  // Add event listener for every time that changes the value
  $('#accountsFilter').change((e) => {
    const opt = $('#accountsFilter').val();
    $('.account-list').hide();
    if (opt === "ALL") {
      $('.account-list').show();
    } else {
      const idLine = "." + opt;
      $('.account-' + opt).show();
    }
  });

});


