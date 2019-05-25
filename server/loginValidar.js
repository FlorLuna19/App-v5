//Función para validar usuarios
function validarUsuario(user, password){
    if (user == "user" && password == "user"){
        return true;

    }if (user == "Maria" && password =="maria"){
        return true;

    }if (user == "Diego" && password =="diego"){
        return true;
    }

    else {
        return false
    }
}

module.exports.validarUsuario = validarUsuario;