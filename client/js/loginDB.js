//Datos de registro
let nombreUsuario = document.getElementById("user-id");

loginUsuario();

//Función de login
function loginUsuario() {


}

//Función que muestra el usuario registrado en el home
function mostrarUsuarioLogueado(callback){
    let request = new XMLHttpRequest();

    request.onload = function() {
    var datosDeUsuarios = request.responseText;

    callback(datosDeUsuarios);
    }
   
    request.open('GET', 'mongodb://localhost: 27017/expressdb');
    request.send();
}



//Muestra datos del usuario logueado en usuario.html
function muestraDatosUsuario(nombreUsuario) {
    var nombre = document.getElementById("user-id");
    console.log("Hola" + nombreUsuario)

}