
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

function checkValidityEmail() {
  // alert()
  // let buttonEmail = document.getElementById("ph_button_email");
  // if ( document.querySelector('#ph_user_email').checkValidity() == true &&
  // document.querySelector('#ph_user_message').checkValidity() == true) {
  //   buttonEmail.removeAttribute("disabled");
  // }else{
  //   buttonEmail.setAttribute("disabled", "");
  // }
   
}


/*Refresh page when close modal email */
$("#ph_modal_email").on("hidden.bs.modal", function() {
  window.location.reload();
});



 

