const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require("path");
const fs = require('fs');
const expressSession = require('express-session');



//Libreria de Mongodb
const mongodb = require('mongodb');
//MongoClient //Usado en 'dbLogin'
const MongoClient = mongodb.MongoClient;
const mongoURL = 'mongodb://localhost:27017';
const dbName = "expressdb";
const client = new MongoClient(mongoURL);

//Utilizamos el método connect para conectarnos a MongoDB
client.connect(function(err, client) {
  // Acá va todo el código para interactuar con MongoDB
  console.log("Conectados a MongoDB");
  // Luego de usar la conexión podemos cerrarla
  client.close();
});




//Uso de Handlebars
const exphbs= require("express-handlebars");

//Js
const login = require('./loginValidar');


//Manejo de sesión en Express
app.use(expressSession({
  secret: 'clave incorrecta',
 resave: false,
 saveUninitialized: false
}))




//Middleware de body parser para json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

//Ruta para uso de elementos estáticos
app.use(express.static(path.join(__dirname, '../client')));
app.use(express.static(path.join(__dirname, '../client/html')));
app.use(express.static(path.join(__dirname, '../client/js')));
app.use(express.static(path.join(__dirname, '../client/css')));


//Handlebars base
app.engine("handlebars", exphbs({
    defaultLayout: "main-layout",
    layoutsDir: path.join(__dirname, "views/layouts")
  })
);
//Seteamos la carpeta para las vistas
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));



//GET
//Ingreso a la carpeta raíz
app.get('/', function (req, res) {
  console.log("Entre al login");
  res.sendFile(path.join(__dirname, '../client/html/index.html'));
})

//Ingreso a home con Handlebars
app.get("/home", function(req, res) {
  console.log("Entre al home con handlebars")
  res.render("home");
});

//Ingreso a usuario
//app.get("/usuario", function(req, res) {
  //console.log("Entre a usuario con handlebars")
  //res.render("usuario");
//});

//Ingreso a recorrido
app.get("/recorrido", function(req, res) {
  console.log("Entre a recorrido con handlebars")
  res.render("recorrido");
});

//Ingreso a empresa
app.get("/empresa", function(req, res) {
  console.log("Entre a empresa con handlebars")
  res.render("empresa");
});

//Ingreso a calendario
app.get("/calendario", function(req, res) {
  console.log("Entre a calendario con handlebars")
  res.render("calendario");
});

//Ingreso a reserva con Mongodb
app.get("/reserva", function(req, res) {
  // Conectamos a MongoDB                      
  client.connect(function(error, client) {
    console.log("Entre a reserva con handlebars y mongodb");

    // Insertamos la base de datos que usaremos
    const db = client.db(dbName);
    console.log(db);

    // Especificamos que coleccion usaremos para tabla Ida
    let coleccionIda = db.collection("horariosIda");

    // Especificamos que coleccion usaremos para tabla Vuelta
    let coleccionVuelta = db.collection("horariosVuelta");

    //Busca los datos de la coleccion y lo transforma en un array
    coleccionVuelta.find().toArray(function(err, datosVuelta) {
      console.log(datosVuelta);


    coleccionIda.find().toArray(function(err, datosIda) {
      //console.log(data);
      res.render("reserva", {
        //Asigno una etiqueta 'datosLugares' para usar los datos del array que traigo de la colección
        datosIda: datosIda,
        datosVuelta: datosVuelta
      });

    });

  });

  });
});


//Ingreso a usuario con Mongodb
app.get("/usuario", function(req, res) {
  // Conectamos a MongoDB                      
  client.connect(function(error, client) {

    // Insertamos la base de datos que usaremos
    const db = client.db("expressdb");

    // Especificamos que coleccion usaremos
    let coleccion = db.collection("usuarios");
    console.log(coleccion);

    coleccion.find().toArray(function(err, data) {
      console.log(data);
      res.render("usuario", {
      data: data
      });

    });
  });
});



//POST / Login 
app.post('/login/form', (req, res) => {

  const nombre = req.body.user;
  const password = req.body.password;


client.connect(function(error, client) {
  // Insertamos la base de datos que usaremos
  const db = client.db("expressdb");


  let coleccionUsuarios = db.collection("usuarios");

  coleccionUsuarios.find({nombre: nombre, password: password}).toArray(function(err, datosLogin) {
    console.log(datosLogin);

    if(datosLogin.length == 1) {
    console.log("estoy logueado")
    res.redirect('/home');
    }else{
      res.redirect('/index.html')
      console.log("no me loguee")
    }
    

  })
})

});






//Server iniciado en puerto 4545
app.listen(4545, function(){
    console.log("Escuchando puerto 4545");
})



/*
//Manejo de sesión en Express
app.use(expressSession({
  secret: 'clave incorrecta',
  resave: false,
  saveUninitialized: false
}))


//GET
//Ingreso a la carpeta raíz
app.get('/', function (req, res) {
    console.log("Entre al login");
    res.sendFile(path.join(__dirname, '../client/html/index.html'));
})


//POST / Login 
app.post('/login', (req, res) => {
  console.log(req.body);

  if (req.body.user !== undefined && req.body.password !== undefined) {
    // Si valido 'ok', redirige al home
    if (login.validarUsuario(req.body.user, req.body.password)) {
      req.session.userId = req.body.user;
      res.send('/home');
    } else {
      req.session.destroy();
      res.sendStatus('/');
    }

  } else {
    // Si el usuario o clave no fueron enviados
    req.session.destroy();
    res.redirect('/home');
    res.status(403).end();
  }
});


//GET / home
app.get('home', (req, res) => {
  //Si el usuario quiere ir al home, valido la sesión.
  if (req.session.userId != undefined) {
    // Lo dirijo al archivo home.html
    res.sendFile(path.join(__dirname, '..client/html/home.html'));
  } else {
    //Si el usuario no tiene una sesión activa lo redirijo a login para que inicie sesión.
    res.redirect('/');
  }
});


//GET logout
app.get('/logout', (req, res) => {
  //Sale de sesión y redirijo al login
  req.session.destroy();
  res.redirect("/");
})

*/