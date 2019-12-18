"use strict";



/*Load Users */



/*DOM Linkers */
let signIn = document.getElementById("ph_sign_in")
let emailPassword = document.querySelector("[id=ph_sign_in_password]")
let emailLabel = document.querySelector("[id=ph_sign_in_email]")
let insertSignInError = document.getElementById("ph_sign_in_error")
let registerAccount = document.getElementById("ph_account_create")
let checkout = document.getElementById("ph_checkout")

/*---------------Register a user-----------------------*/
let registerName = document.getElementById("ph_register_name")
let registerLastname = document.getElementById("ph_register_lastname")
let registerEmail = document.getElementById("ph_register_email")
let registerPassword1 = document.getElementById("ph_register_password1")
let registerPassword2 = document.getElementById("ph_register_password2")
let registerAlert = document.getElementById("ph_register_alert")
let registerLabel = document.getElementById("ph_register_label")

/*---------------Email---------------- */
let buttonEmail = document.getElementById("ph_button_email")
let userEmail = document.getElementById("ph_user_email")
let userMessage = document.getElementById("ph_user_message")
let emailWarning = document.getElementById("ph_email_warning")





window.onload = function () {
    if (sessionStorage.getItem("tokenUser")) {
        checkout.removeAttribute("hidden")
    }

};

signIn.addEventListener("click", function (event) {
    checkUser({
        email: emailLabel.value,
        password: emailPassword.value
    })
})

registerAccount.addEventListener("click", function (event) {

    let xhr = new XMLHttpRequest();
    xhr.open('POST', "http://localhost:3002/users")
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify({
        name: registerName.value,
        lastname: registerLastname.value,
        email: registerEmail.value,
        password: registerPassword1.value,
    }))
    xhr.onload = function () {
        switch (xhr.status) {
            case 400:

                registerAlert.innerHTML = `
                <div class="alert alert-warning alert-dismissible fade show">
                <strong>Error para registrar usuario</strong>
                </div>
                `
                console.log(xhr.responseText);

                break;
            case 401:
                registerAlert.innerHTML = `
                    <div class="alert alert-warning alert-dismissible fade show">
                    <strong>Este usuario ya existe</strong>
                    </div>
                    `
                break;
            case 200:
                registerName.setAttribute("hidden", "")
                registerLastname.setAttribute("hidden", "")
                registerEmail.setAttribute("hidden", "")
                registerPassword1.setAttribute("hidden", "")
                registerPassword2.setAttribute("hidden", "")
                registerLabel.setAttribute("hidden", "")
                registerAccount.setAttribute("hidden", "")
                registerAlert.innerHTML = `
                <div class="alert alert-success alert-dismissible fade show">
                    <strong>Hemos enviado un link a tu correo, verificalo porfavor.</strong>
                    </div>
                `
                console.log(xhr.responseText);
                break;

            default:

                console.log(`${xhr.status} : ${xhr.statusText}`)

                break;
        }


    }
})

checkout.addEventListener("click", (event) => {
    window.location.href = '../checkout/index.html'
})

buttonEmail.addEventListener("click", (event) => {
    let xhr = new XMLHttpRequest();
    xhr.open('POST', "http://localhost:3002/email")
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify({
        email: userEmail.value,
        message: userMessage.value
    }))
    
    xhr.onload = function () {
        switch (xhr.status) {
            case 400:

                emailWarning.innerHTML = `
                    <div class="alert alert-danger alert-dismissible fade show">
                        <strong>Error</strong>
                        ${xhr.responseText}
                    </div>
                    `
                console.log(xhr.responseText);

                break;

            case 200:

                emailWarning.innerHTML = `
                    <div class="alert alert-success alert-dismissible fade show">
                        <strong>Mensaje enviado con éxito</strong>
                        Nos pondremos en contacto de inmediato contigo.
                    </div>
                    `
                console.log(xhr.responseText);
                break;

            default:

                console.log(`${xhr.status} : ${xhr.statusText}`)

                break;
        }


    }
})

/*Refresh page when close modal email */
$('#ph_modal_email').on('hidden.bs.modal', function() {
    window.location.reload();
});

/*Javascript functions BackEnd*/

function checkUser(user) {
    let response
    let xhr = new XMLHttpRequest();
    xhr.open('POST', "http://localhost:3002/login")
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(user))
    xhr.onload = function () {
        switch (xhr.status) {
            case 400:

                console.log(xhr.responseText);
                insertSignInError.removeAttribute("hidden")
                break;
            case 200:

                response = JSON.parse(xhr.responseText)
                sessionStorage.setItem("tokenUser", response.token)
                sessionStorage.setItem("userEmail", emailLabel.value)
                window.location.href = '../../page/index.html'
                break;

            default:

                console.log(`${xhr.status} : ${xhr.statusText}`)
                break;
        }


    }

}

$(document).ready(function () {


    $('input').on("input", function () {


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

        } else {
            $('input[name=up],input[name=up2]').css({
                "border": "none"
            })

        }

        if (userEmail.checkValidity()) {
            buttonEmail.removeAttribute("disabled")
        }else{
            buttonEmail.setAttribute("disabled", "")
        }
        if (document.querySelector("input:invalid") == undefined && pass == repass) {
            registerAccount.removeAttribute("disabled")
            
        } else {
            registerAccount.setAttribute("disabled", "")
            
            registerAlert.innerHTML = `
                    <div class="alert alert-warning alert-dismissible fade show">
                    <strong>Revisa los campos en rojo y acepta los términos</strong>
                    </div>
                    `
        }

    })
})