"use strict";


window.onload = function() {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', "http://localhost:3000/users/")
    xhr.setRequestHeader("Content-Type", "application/json");   
    xhr.send()
    xhr.onload  = function () {
        switch (xhr.status) {
            case 403:
                
                console.log(xhr.responseText);
                break;
            case 200:
                
                users = JSON.parse(xhr.responseText) 
                console.log(xhr.responseText);
                break;
        
            default:
                   
                console.log(`${xhr.status} : ${xhr.statusText}`)
                break;
        }
       

    }
  };

/*Load Users */
let users
   

/*DOM Linkers */
let signIn = document.getElementById("ph_sign_in")
let emailPassword = document.querySelector("[id=ph_sign_in_password]")
let emailLabel = document.querySelector("[id=ph_sign_in_email]")
let insertSignInError = document.getElementById("ph_sign_in_error")
let registerAccount = document.getElementById("ph_account_create")

signIn.addEventListener("click",function (event) {
    checkUser({
        email:emailLabel.value,
        password:emailPassword.value
    })
})

registerAccount.addEventListener("submit",function (event) {
    event.preventDefault()
    alert("he")
})




/*Javascript functions BackEnd*/

function checkUser(user) {
    var user
    if (users != undefined) {
        user = users.find(element => {
        if(element.email == user.email && element.password == user.password){
            
            return element
        }    
        });
        if(user == undefined){
            insertSignInError.removeAttribute("hidden")
        }else{
            window.location.href = 'page/index.html'
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