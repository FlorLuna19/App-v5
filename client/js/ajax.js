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


//Funciones
function reservarLugar(dia, lugares) {

    console.log("Para el dia:", dia);
    console.log("Hay disponibles", lugares, "lugares");

    if(lugares >= 1) {
        
        console.log("Hago la reserva")

    }else{
        if(lugares <= 0) {
            console.log("No puedo hacer la reserva")
        }
    }

}

