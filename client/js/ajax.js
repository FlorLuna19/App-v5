function pedirDatosReserva(callback){
    let request = new XMLHttpRequest();

    request.onload = function() {

        let datosLugares = JSON.parse(request.responseText);
        //console.log(datosLugares);
        callback(datosLugares);
    }
    request.open('GET', 'datos/reserva');
    request.send()
}


function pedirDatosReservaVuelta(callback){
    let request = new XMLHttpRequest();

    request.onload = function() {

        let datosLugaresVuelta = JSON.parse(request.responseText);
        //console.log(datosLugares);
        callback(datosLugaresVuelta);
    }
    request.open('GET', 'datos/reservaVuelta');
    request.send()
}