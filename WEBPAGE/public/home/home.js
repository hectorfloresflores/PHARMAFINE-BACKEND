
"use strict";
document.addEventListener("click", function(event) {
  let userEmail = document.getElementById("ph_user_email");
  let userMessage = document.getElementById("ph_user_message");
  let emailWarning = document.getElementById("ph_email_warning");
  let xhr = new XMLHttpRequest();
  switch (event.target.id) {
        case "ph_button_email":
          xhr.open("POST", "http://localhost:3002/email");
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(
          JSON.stringify({
            email: userEmail.value,
            message: userMessage.value
          })
        );
      
        xhr.onload = function() {
          switch (xhr.status) {
            case 400:
              emailWarning.innerHTML = `
                          <div class="alert alert-danger alert-dismissible fade show">
                              <strong>Lo sentimos,</strong>
                              el mensaje no se pudo enviar
                          </div>
                          `;
              console.log(xhr.responseText);
      
              break;
      
            case 200:
              emailWarning.innerHTML = `
                          <div class="alert alert-success alert-dismissible fade show">
                              <strong>Mensaje enviado con éxito</strong>
                              Nos pondremos en contacto de inmediato contigo.
                          </div>
                          `;
              console.log(xhr.responseText);
              break;
      
            default:
              console.log(`${xhr.status} : ${xhr.statusText}`);
      
              break;
          }
        };
          break;
          default:
          break;
  }
})
function myFunction() {
  
  let buttonEmail = document.getElementById("ph_button_email");
  if ( document.querySelector('#ph_user_email').checkValidity() == true &&
  document.querySelector('#ph_user_message').checkValidity() == true) {
    buttonEmail.removeAttribute("disabled");
  }else{
    buttonEmail.setAttribute("disabled", "");
  }
   

    // $("input").on("input", function() {
    //     $("input:invalid").each(function(item) {
    //       $(this).css({
    //         border: "2px solid rgb(224, 10, 1)"
    //       });
    //     });
    //     $("input:valid").each(function(item) {
    //       $(this).css({
    //         border: "none"
    //       });
    //     });
    //     var pass = $("input[name=up]").val();
    //     var repass = $("input[name=up2]").val();
    //     // if (
    //     //   $("input[name=up]").val().length < 1 ||
    //     //   $("input[name=up2]").val().length < 1 ||
    //     //   pass != repass
    //     // ) {
    //     //   $("input[name=up],input[name=up2]").css({
    //     //     border: "2px solid rgb(224, 10, 1)"
    //     //   });
    //     // } else {
    //     //   $("input[name=up],input[name=up2]").css({
    //     //     border: "none"
    //     //   });
    //     // }
    
    //     if (userEmail.checkValidity()) {
    //       buttonEmail.removeAttribute("disabled");
    //     } else {
    //       buttonEmail.setAttribute("disabled", "");
    //     }
    //     if (
    //       document.querySelector("input:invalid") == undefined &&
    //       pass == repass
    //     ) {
    //       registerAccount.removeAttribute("disabled");
    //     } else {
    //       registerAccount.setAttribute("disabled", "");
    
    //       document.getElementById("ph_register_alert").innerHTML = `
    //                     <div class="alert alert-danger alert-dismissible fade show">
    //                     <strong>Llena todos los campos en rojo, revisa que tus contraseñas sean iguales y acepta los términos</strong>
    //                     </div>
    //                     `;
    //     }
    //   });
}



/*Refresh page when close modal email */
$("#ph_modal_email").on("hidden.bs.modal", function() {
  window.location.reload();
});



 

