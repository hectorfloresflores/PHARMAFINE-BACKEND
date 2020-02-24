"use strict";

/*Reference of server */
let serverLink = "http://localhost:3002";

/* Navigation links */
let miAccount = document.querySelector(`[data-target="#ph_signin_modal"]`);

/*Modal Account------------------------ */
let modalAccount = document.getElementById("ph_modal_account");
/*-------------------------------------- */

// let registerAccount = document.getElementById("ph_account_create");
let checkout = document.getElementById("ph_checkout");

/*---------------Register a user-----------------------*/


/*---------------Email---------------- */



window.addEventListener("load", function() {
  
  if (
    sessionStorage.getItem("userEmail") == null ||
    sessionStorage.getItem("tokenUser") == null
  ) {
    document.querySelector(".cuenta").innerText = `Iniciar sesión`;
    return;
  }
  let xhr = new XMLHttpRequest();
  xhr.open("GET", `${serverLink}/users`);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader("email", `${sessionStorage.getItem("userEmail")}`);
  xhr.setRequestHeader("x-auth", sessionStorage.getItem("tokenUser"));
  xhr.send();
  xhr.onload = function() {
    switch (xhr.status) {
      case 200:
        document.querySelector(".cuenta").innerText = `Mi perfil`;
        console.log(xhr.status);
        break;
      default:
        
        document.querySelector(".cuenta").innerText = `Iniciar sesión`;
        break;
    }
  };
 
});

/*When user click on signin button*/
document.addEventListener("click", function(event) {
  
    let xhr = new XMLHttpRequest();
  switch (event.target.id) {
    case "ph_sign_in":
        
      let response;
      let emailPassword = document.querySelector("[id=ph_sign_in_password]");
      let emailLabel = document.querySelector("[id=ph_sign_in_email]");
      let insertSignInError = document.getElementById("ph_sign_in_error");
      if (
        emailLabel.value == "" ||
        emailPassword.value == ""
      ) {
        insertSignInError.removeAttribute("hidden");
        return;
      }
      let user = {
        email: emailLabel.value,
        password: emailPassword.value
      };
      
      xhr.open("POST", "http://localhost:3002/login");
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.send(JSON.stringify(user));
      xhr.onload = function() {
        switch (xhr.status) {
          case 400:
            console.log(xhr.responseText);
            insertSignInError.removeAttribute("hidden");
            break;
          case 401:
            insertSignInError.innerHTML = `<strong>Usuario no verificado</strong> Verifica el link que enviamos a tu correo`
            insertSignInError.removeAttribute("hidden");
            break;
            
          case 200:
            response = JSON.parse(xhr.responseText);
            sessionStorage.setItem("tokenUser", response.token);
            sessionStorage.setItem("userEmail", emailLabel.value);
            location.reload();
            break;

          default:
            console.log(`${xhr.status} : ${xhr.statusText}`);
            break;
        }
      };
      break;
    case "ph_register_account":
      document.getElementById("ph_modal_account").innerHTML = `
        <div class="modal-header">
          <h5 class="modal-title" id="ph_modal_title">Registro de usuario</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
            <div class="row justify-content-center">
              <div class="form-group col-md-6">
                <input id="ph_register_name" type="text" class="form-control" placeholder="Nombre" required onkeypress="checkValidityRegister()" />
              </div>
              <div class="form-group col-md-6">
                <input id="ph_register_lastname" type="text" class="form-control" placeholder="Apellidos" required onkeyup="checkValidityRegister()"/>
              </div>
            </div>
            <div class="form-group">
              <input id="ph_register_email" type="email" class="form-control" placeholder="Correo" required onkeyup="checkValidityRegister()"/>
            </div>
            <div class="form-group">
              <input id="ph_register_password1" type="password" class="form-control" placeholder="Contraseña" required name=up onkeyup="checkValidityRegister()"/>
            </div>
            <div class="form-group">
              <input id="ph_register_password2" type="password" class="form-control"  placeholder="Confirmar Contraseña" required name=up2 onkeyup="checkValidityRegister()"/>
            </div>
            <div class="form-group ">
              <label id="ph_register_label" class="checkbox-inline"><input type="checkbox" required> Acepto los <a href="#">términos
                  de uso</a> y el <a href="#"> aviso de privacidad</a></label>
            </div>
            <div id="ph_register_alert">
            </div>
          </div>
          <div class="modal-footer">
            <button id="ph_account_create" class="btn btn-outline-success" disabled
              type="button" >Crear Cuenta</a>
          </div>
        `;
      break;

    case "ph_account_create":
        let registerName = document.getElementById("ph_register_name");
        let registerLastname = document.getElementById("ph_register_lastname");
        let registerEmail = document.getElementById("ph_register_email");
        let registerPassword1 = document.getElementById("ph_register_password1");
        let registerPassword2 = document.getElementById("ph_register_password2");
        let registerAlert = document.getElementById("ph_register_alert");
        let registerLabel = document.getElementById("ph_register_label");

      
      xhr.open("POST", "http://localhost:3002/users");
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.send(
        JSON.stringify({
          name: registerName.value,
          lastname: registerLastname.value,
          email: registerEmail.value,
          password: registerPassword1.value
        })
      );
      xhr.onload = function() {
        switch (xhr.status) {
          case 400:
            registerAlert.innerHTML = `
                      <div class="alert alert-warning alert-dismissible fade show">
                      <strong>Error para registrar usuario</strong>
                      </div>
                      `;
            console.log(xhr.responseText);

            break;
          case 401:
            registerAlert.innerHTML = `
                          <div class="alert alert-warning alert-dismissible fade show">
                          <strong>Este usuario ya existe</strong>
                          </div>
                          `;
            break;
          case 200:
            $('#ph_signin_modal').modal('hide');
           
            let response = JSON.parse(xhr.responseText);
            //Decide to show
            xhr.open("GET", `http://localhost:3002/sendEmailConfirmation?token=${response.token}&email=${registerEmail.value}`);
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.send();
            xhr.onload = function() {
              switch (xhr.status) {
                case 400:
                console.log("errores")
                  break;
                case 200:
                  document.getElementById("ph_modal_account").innerHTML = `
                  
                  <div class="modal-header">
                  <h5 class="modal-title" id="ph_modal_title">Registro de usuario</h5>
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div class="modal-body">
                  <form id="ph_sign_in_form">
                  <div class="alert alert-success alert-dismissible fade show">
                  <strong>Hemos enviado un link a tu correo, verificalo porfavor.</strong>
                  </div>
                    </div>
                  </form>
                </div>
                  `
                  $('#ph_signin_modal').modal('show');
                  break;

                default:
                  console.log(`${xhr.status} : ${xhr.statusText}`);
                  break;
              }
            };
           
            console.log(xhr.responseText);
            break;

          default:
            console.log(`${xhr.status} : ${xhr.statusText}`);

            break;
        }
      };
      break;

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
                              <strong>Error</strong>
                              ${xhr.responseText}
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
    case "cuenta":
        let defaultSignin = `
        <div class="modal-header">
        <h5 class="modal-title" id="ph_modal_title">Iniciar Sesión</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <form id="ph_sign_in_form">
          <div class="form-group">
            <label for="exampleInputEmail">Correo ó Usuario</label>
            <input type="email" class="form-control" id="ph_sign_in_email" placeholder="Introduce tu correo" />
          </div>
          <div class="form-group">
            <label for="ph_sign_in_password">Contraseña</label>
            <input type="password" class="form-control" id="ph_sign_in_password"
              placeholder="Introduce tu contraseña" />
          </div>
          <button type="button"  id="ph_sign_in" class="btn btn-outline-secondary">Ingresar</button>
          <p></p>
          <div id="ph_sign_in_error" class="alert alert-warning alert-dismissible fade show" hidden>
            <strong>Error de auntenticación</strong> Revisa usuario o contraseña
    
          </div>
        </form>
      </div>
      <div class="modal-footer"> 
        <button type="button" id="ph_register_account" class="btn btn-outline-success" 
        role="button">Register</a>
      
      </div>
        `;
      if (
        sessionStorage.getItem("userEmail") == null ||
        sessionStorage.getItem("tokenUser") == null
      ) {
        document.getElementById("ph_modal_account").innerHTML = defaultSignin;
        
        return;
      }
      
      xhr.open("GET", `${serverLink}/users`);
      
      xhr.setRequestHeader("email", `${sessionStorage.getItem("userEmail")}`);
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.setRequestHeader("x-auth", sessionStorage.getItem("tokenUser"));
      xhr.send();
      xhr.onload = function() {
        switch (xhr.status) {
          case 200:
            document.getElementById("ph_modal_account").innerHTML = `
                <div class="modal-header">
              <h5 class="modal-title" id="ph_modal_title"></h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <form id="ph_sign_in_form">
                <div class="form-group">
                  <label >Nombre</label>
                  <input disabled class="form-control"  placeholder="${
                    JSON.parse(xhr.responseText).name
                  }" />
                </div>
                <div class="form-group">
                  <label >Correo</label>
                  <input disabled class="form-control"  placeholder="${
                    JSON.parse(xhr.responseText).email
                  }" />
                </div>
                <div class="form-group">
                  <label >Apellidos</label>
                  <input disabled class="form-control"  placeholder="${
                    JSON.parse(xhr.responseText).lastname
                  }" />
                </div>
               
            </div>
            <div class="modal-footer">
            <a href=""  id="ph_logout" class="btn btn-outline-danger mr-auto" 
            role="button">Cerrar sesión</a>  
              <a href=""  data-toggle="modal" class="btn btn-outline-secondary" data-dismiss="modal"
                role="button">Editar mi perfil</a>
            </div>
                `;
    
            document.getElementById("ph_modal_title").innerText = `¡Hola ${
              JSON.parse(xhr.responseText).name
            }!`;
            console.log(xhr.status);
            break;
    
          default:
            document.getElementById("ph_modal_account").innerHTML = defaultSignin;
            
            break;
        }
      };
        break;
    case 'bolsa':
      window.location.href = "../checkout/index.html";
    break;
    case 'ph_home':
      document.location.href="../home";
      break;
    case 'ph_logout': 
      sessionStorage.setItem('tokenUser',null)
      window.location.reload();
    default:
      break;
  }
});


function checkValidityRegister() {

   

    $("input").on("input", function() {
        $("input:invalid").each(function(item) {
          $(this).css({
            border: "2px solid rgb(224, 10, 1)"
          });
        });
        $("input:valid").each(function(item) {
          $(this).css({
            border: "none"
          });
        });
        var pass = $("input[name=up]").val();
        var repass = $("input[name=up2]").val();
        // if (
        //   $("input[name=up]").val().length < 1 ||
        //   $("input[name=up2]").val().length < 1 ||
        //   pass != repass
        // ) {
        //   $("input[name=up],input[name=up2]").css({
        //     border: "2px solid rgb(224, 10, 1)"
        //   });
        // } else {
        //   $("input[name=up],input[name=up2]").css({
        //     border: "none"
        //   });
        // }
    
    
        if (
          document.querySelector("input:invalid") == undefined &&
          pass == repass
        ) {
          document.getElementById("ph_account_create").removeAttribute("disabled");
        } else {
          document.getElementById("ph_account_create").setAttribute("disabled", "");
    
          document.getElementById("ph_register_alert").innerHTML = `
                        <div class="alert alert-danger alert-dismissible fade show">
                        <strong>Llena todos los campos en rojo, revisa que tus contraseñas sean iguales y acepta los términos</strong>
                        </div>
                        `;
        }
      });
}
