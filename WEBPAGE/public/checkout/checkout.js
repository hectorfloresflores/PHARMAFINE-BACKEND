"use strict";



window.onload = function() {
    
    var products = getProducts()
   
};

let table = document.querySelector("tbody")

function renderProduct(product) {
   return `
    <tr>
    <td class="w-25">
        <img src="${product.image}" class="img-fluid img-thumbnail" alt="Sheep">
    </td>
    <td>${product.name}</td>
    <td>$${product.price}</td>
    <td class="qty"><input type="text" class="form-control" id="input1" value="2"></td>
    <td>$${product.price}</td>
    <td>
        <a href="#" class="btn btn-danger btn-sm">
            <i class="fa fa-times"></i>
        </a>
    </td>
</tr>
    `
}


function getProducts() {
    let response
    let xhr = new XMLHttpRequest();
    xhr.open('GET', "http://localhost:3002/checkout")
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("x-auth", sessionStorage.getItem("tokenUser"));  
    xhr.setRequestHeader("email", sessionStorage.getItem("userEmail"));  
    xhr.send()
    
    xhr.onload  = function () {
        switch (xhr.status) {
            case 400:
                
                console.log(xhr.responseText);
                
                break;
            case 200:
                
                
                let productsrendered = JSON.parse(xhr.responseText).map(element => {
                    return renderProduct(element)
               }).join('');
               table.innerHTML = productsrendered
               console.log(productsrendered);
                break
        
            default:
                   
                 console.log(`${xhr.status} : ${xhr.statusText}`)
                break;
        }
       

    }

}