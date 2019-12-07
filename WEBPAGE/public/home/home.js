"use strict";



/*Load Users */

   

/*DOM Linkers */
let signIn = document.getElementById("ph_sign_in")
let emailPassword = document.querySelector("[id=ph_sign_in_password]")
let emailLabel = document.querySelector("[id=ph_sign_in_email]")
let insertSignInError = document.getElementById("ph_sign_in_error")
let registerAccount = document.getElementById("ph_account_create")
let checkout = document.getElementById("ph_checkout")


window.onload = function() {
    if (sessionStorage.getItem("tokenUser")) {
        checkout.removeAttribute("hidden")
    }
    
};

signIn.addEventListener("click",function (event) {
    checkUser({
        email:emailLabel.value,
        password:emailPassword.value
    })
})

registerAccount.addEventListener("submit",function (event) {
    window.location.href = '../checkout/index.html'
})

checkout.addEventListener("click",(event)=>{
    window.location.href = '../checkout/index.html'
})




/*Javascript functions BackEnd*/

function checkUser(user) {
    let response
    let xhr = new XMLHttpRequest();
    xhr.open('POST', "http://localhost:3002/login")
    xhr.setRequestHeader("Content-Type", "application/json");   
    xhr.send(JSON.stringify(user))
    xhr.onload  = function () {
        switch (xhr.status) {
            case 400:
                
                console.log(xhr.responseText);
                insertSignInError.removeAttribute("hidden")
                break;
            case 200:
                
                response = JSON.parse(xhr.responseText) 
                sessionStorage.setItem("tokenUser",response.token)
                sessionStorage.setItem("userEmail",emailLabel.value)
                window.location.href = '../../page/index.html'
                break;
        
            default:
                   
                console.log(`${xhr.status} : ${xhr.statusText}`)
                break;
        }
       

    }

}

$(document).ready(function () {


    $('input').on("input",function () {
        $("input:invalid").each(function (item) {
            $(this).css({
                "border": "2px solid rgb(224, 10, 1)"
            })
        })
        $("input:valid").each(function (item) {
            $(this).css({
                "border": "none"
            })
        })
        var pass = $('input[name=up]').val();
        var repass = $('input[name=up2]').val();
        if (($('input[name=up]').val().length < 1) || ($('input[name=up2]').val().length < 1) || pass != repass) {
            $('input[name=up],input[name=up2]').css({
                "border": "2px solid rgb(224, 10, 1)"
            })
            
        }else {
            $('input[name=up],input[name=up2]').css({
                "border": "none"
            })
           
        }

    })
})