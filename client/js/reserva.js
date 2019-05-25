//app web
let divContenedorLugares = document.getElementById("divContenedorLugares");
let botonConsulta = document.getElementById("boton-consulta");


//Se crean variables para contener los botones 
let divContenedorVuelta = document.getElementById("divContenedorVuelta")
let botonConsulta2 = document.getElementById("boton-consulta2");



//Se le asigna al boton consulta un evento click
botonConsulta.addEventListener("click", function(){
    console.log("Llegue al evento");
    //Se ejecuta la funcion pedirDatos
    pedirDatosReserva(crearBotonesDias);
})


//Se crea la funcion para crear los botones por dia
function crearBotonesDias(datos){
    //Se vacia el contenedor 
    divContenedorLugares.innerHTML = "";

    let listaDeHorarios = datos;
    console.log(listaDeHorarios);

    //Se recorre el array listaDeHorarios
    for(let i = 0; i < listaDeHorarios.length; i++){
        crearBotonPorDia(listaDeHorarios[i].dia, listaDeHorarios[i].horario, listaDeHorarios[i].disponibilidad);
    }
}

//Funcion que crea los botones con los horarios por dia
function crearBotonPorDia(dia, horario, disponibilidadDelDia){
    let botonDia = document.createElement("button");
    let espaciado = document.createElement('br')
    botonDia.setAttribute("class", "estilo-boton");
    let textoDia = document.createTextNode(dia);
    let textoHorario = document.createTextNode(horario);
    botonDia.appendChild(textoDia);
    botonDia.append(espaciado);
    botonDia.appendChild(textoHorario);


    botonDia.addEventListener("click", function(){
        validacion(disponibilidadDelDia);
    })

    divContenedorLugares.appendChild(botonDia);
    
}


//Funcion que valida la disponibilidad de los horarios
function validacion(disponibilidad) {
    if ( disponibilidad == true) {

        var ventana = document.getElementById('modalOk');
        ventana.style.display= "block";
        console.log("Se muestra el resultado de la reserva")
        console.log("Reserva realizada");
        
    }else{
        var ventana = document.getElementById('modalNo');
        ventana.style.display= "block";
        console.log("Se muestra la ventana de no disponibilidad")
        console.log("No hay disponibilidad")
    }
}





///Funciones para boton consulta VUELTA
//Se le asigna al boton consulta un evento click
botonConsulta2.addEventListener("click", function(){
    console.log("Llegue a vuelta");
    //Se ejecuta la funcion pedirDatos
    pedirDatosReservaVuelta(crearBotonesDiasVuelta);
})

//Se crea la funcion para crear los botones por dia
function crearBotonesDiasVuelta(datos){
    //Se vacia el contenedor 
    divContenedorVuelta.innerHTML = "";

    let listaDeHorarios = datos;
    console.log(listaDeHorarios);

    //Se recorre el array listaDeHorarios
    for(let i = 0; i < listaDeHorarios.length; i++){
        crearBotonPorDiaVuelta(listaDeHorarios[i].dia, listaDeHorarios[i].horario, listaDeHorarios[i].disponibilidad);
    }
}

//Funcion que crea los botones con los horarios por dia
function crearBotonPorDiaVuelta(dia, horario, disponibilidadDelDia){
    let botonDia = document.createElement("button");
    let espaciado = document.createElement('br')
    botonDia.setAttribute("class", "estilo-botonVuelta");
    let textoDia = document.createTextNode(dia);
    let textoHorario = document.createTextNode(horario);
    botonDia.appendChild(textoDia);
    botonDia.append(espaciado);
    botonDia.appendChild(textoHorario);


    botonDia.addEventListener("click", function(){
        validacion(disponibilidadDelDia);
    })

    divContenedorVuelta.appendChild(botonDia);
    
}





//VENTANA MODAL
function mostrarVentana() {
    var ventana = document.getElementById('ventanaModalOk');
    ventana.style.display= "block";
    console.log("Se muestra el resultado de la reserva")
}

function ocultarVentana() {
    var ventana = document.getElementById('ventanaModalOk');
    ventana.style.display="none";
    
    console.log("Se cierra la ventana de reserva")
}