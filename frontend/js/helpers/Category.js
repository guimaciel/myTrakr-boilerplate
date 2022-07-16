let categoriesArray = [];

// Get Categories
export const getCategories = function () {
  $.ajax({
    method: "get",
    url: "http://localhost:3000/categories",
    dataType: "json",
  }).done((catArray) => {
   categoriesArray = catArray;
    fillSelectCat("");
    return catArray;
  });
}

// Create event listener for click on 'Add new category' button
export const addNewCategory = function ()  {
   // console.log(categoriesArray);
   const newCat = $('#newCategory').val();
   if (!newCat) {
      alert("Please insert value for new category!")
      return;
   }
   // Validate if input username already exists
  const catNameArr = [];
  categoriesArray.forEach((element) => {
    catNameArr.push(element.name);
  })
  if (catNameArr.includes(newCat)) {
    alert("This category already exists!");
    return;
  }
   
   // Every new category added, it should be sent to save in the server using Ajax.
   let newCatObj = { newCategory: newCat, };
   // console.log(newCatObj);
   $.ajax({
      method: "post",
      data: JSON.stringify({ newCategory: newCat, }),
      url: "http://localhost:3000/categories",
      contentType: "application/json; charset=utf-8",
      traditional: true,
   }).done((data) => {
      // console.log(data);
      categoriesArray.push(data);
      fillSelectCat(data);
      $('.newCategory').hide();
      $('#newCategory').val("");
   });

}

function fillSelectCat(newCat) {
//   console.log("New Cat:" , newCat);
//   console.log("Array: ", categoriesArray);
  $('#category').empty();
  $('#category').append('<option value="" selected></option>');
  let selected = "";
  categoriesArray.forEach((element) => {
    if (newCat && newCat.id === element.id ) {
      selected = " selected ";
    } else {
      selected = "";
    }
    $('#category').append(`
      <option value="${element.name}" ${selected}>${element.name}</option>
    `);
  })
  $('#category').append('<option value="new">Add new...</option>');

}

export default {getCategories, addNewCategory};