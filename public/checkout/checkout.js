"use strict";

window.onload = function() {
  getProducts();
};

var products
let table = document.querySelector("tbody");

function renderProduct(product) {
  return `
<tr ">
    <th scope="row">
    <div class="p-2">
        <img src="${product.image}" alt="" width="70" class="img-fluid rounded shadow-sm">
        <div class="ml-3 d-inline-block align-middle">
        <h5 class="mb-0"> <a href="#" class="text-dark d-inline-block">${product.name}</a></h5><span class="text-muted font-weight-normal font-italic">Category: Fashion</span>
        </div>
    </div>
    <td class="align-middle"><strong>$${product.price}</strong></td>
    <td class="align-middle"><strong>${product.quantity}</strong></td>
    <td class="align-middle"><a href="#" class="text-dark"><i id="${product.id}" class="fa fa-trash"></i></a>
    </td>
</tr>
`;
}

function getProducts() {
  let response;
  let xhr = new XMLHttpRequest();
  xhr.open("GET", "http://localhost:3002/checkout");
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader("x-auth", sessionStorage.getItem("tokenUser"));
  xhr.setRequestHeader("email", sessionStorage.getItem("userEmail"));
  xhr.send();

  xhr.onload = function() {
    switch (xhr.status) {
      case 400:
        console.log(xhr.responseText);
        
        break;
      case 200:
        products = JSON.parse(xhr.responseText)
          .map(element => {
            return renderProduct(element);
          })
          .join("");
          

        table.innerHTML = products;
        
        break;

      default:
        console.log(`${xhr.status} : ${xhr.statusText}`);
        break;
    }
  };
}


/*When user click on signin button*/
document.addEventListener("click", function(event) {

  if (event.target.classList.contains('fa-trash')) {
    let xhr = new XMLHttpRequest();
    xhr.open("DELETE", "http://localhost:3002/checkout");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("x-auth", sessionStorage.getItem("tokenUser"));
    xhr.setRequestHeader("email", sessionStorage.getItem("userEmail"));
    xhr.send( JSON.stringify({
      products: event.target.id
    }));

    xhr.onload = function() {
      switch (xhr.status) {
        case 400:
          console.log(xhr.responseText);
          window.location.reload();
          break;
        case 200:
          console.log(xhr.responseText);
          window.location.reload();
          break;

        default:
          console.log(`${xhr.status} : ${xhr.statusText}`);
          break;
      }
    };
  }

});

