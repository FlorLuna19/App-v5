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

// Utilizamos el método connect para conectarnos a MongoDB
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
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));



//GET
//Ingreso a la carpeta raíz
// RUTA REGISTRAR HANDLEBARS
app.get("/home", function(req, res) {
  console.log("Entre al home con handlebars")
  res.render("home");
});

//Ingreso a usuario
app.get("/usuario", function(req, res) {
  console.log("Entre a usuario con handlebars")
  res.render("usuario");
});

//Ingreso a reserva
app.get("/reserva", function(req, res) {
  console.log("Entre a reserva con handlebars")
  res.render("reserva");
});

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

//Probando incorporar mongo en reservas--
app.get("/reserva", function(req, res) {
  // Conectamos a MongoDB                      
  client.connect(function(error, client) {
    console.log("estoy aca");

    // Insertamos la database que usaremos
    const db = client.db("expressdb");
    console.log(db);

    // Especificamos que coleccion usaremos
    let coleccion = db.collection("usuarios");
    console.log(coleccion);

    coleccion.find().toArray(function(err, data) {
      console.log(data);
      res.render("reserva", {
        data: data
      });

    });
  });
});





//Server iniciado en puerto 4545
app.listen(4545, function(){
    console.log("Escuchando puerto 4545");
})



/*
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
const mongoURL = 'mongodb://localhost: 27017';
const dbName = "expressdb";

//Uso de Handlebars
const exphbs= require("express-handlebars");

//Js
const login = require('./loginValidar');
//const reserva = require('./reserva');//agregue

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


//Configuración vista con Handlebars
// Acá seteamos como motor de renderizado de vistas "handlebars"
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


//POST / home
app.get('/home', function (req, res) {
    console.log("Entre al home");
    res.sendFile(path.join(__dirname, '../client/html/home.html'));
})


app.get('/usuario', function (req, res) {
    console.log("Entre a usuario");
    res.sendFile(path.join(__dirname, '../client/html/usuario.html'));
})

app.get('/reserva', function (req, res) {
  console.log("Entre a reserva");
  res.sendFile(path.join(__dirname, '../client/html/reserva.html'));
})

app.get('/recorrido', function (req, res) {
  console.log("Entre a recorrido");
  res.sendFile(path.join(__dirname, '../client/html/recorrido.html'));
})

app.get('/empresa', function (req, res) {
  console.log("Entre a empresa");
  res.sendFile(path.join(__dirname, '../client/html/empresa.html'));
})


//Dirijo la ruta para que ingrese a reserva con handlebars
app.get('/reservahandlebars', function (req, res) {
  console.log("Entre a reserva con handlebars");
  res.sendFile(path.join(__dirname, '../client/html/reservaHANDLE.html'));
})





app.get('/datos/datosUsuarios', function (req, res) {

  fs.readFile(path.join(__dirname, 'datosUsuarios.json'), function(err, data) {
    if (err == undefined) {
      let listaUsuarios = JSON.parse(data);

      res.send(listaUsuarios);
    }
  })  
})



//Uso archivo reserva
app.get('/datos/reserva', function (req, res) {
  fs.readFile(path.join(__dirname, 'disponibilidad.json'), (err, data) => {
    if (err == undefined) {
      let jsonDatosDiasReserva = JSON.parse(data);
      res.send(jsonDatosDiasReserva)
    }
    })
  console.log("Lei disponibildad.json");

})

//Uso archivo reserva para vuelta
app.get('/datos/reservaVuelta', function (req, res) {
  fs.readFile(path.join(__dirname, 'disponibilidad2.json'), (err, data) => {
    if (err == undefined) {
      let jsonDatosDiasReservaVuelta = JSON.parse(data);
      res.send(jsonDatosDiasReservaVuelta)
    }
    })
  console.log("Lei disponibildad2");

})


///**agregados handlebars 
//GET
//Ingreso a la carpeta raíz
// RUTA REGISTRAR HANDLEBARS
app.get("/home", function(req, res) {

  res.render("home");

});








//NO LO VAMOS A USAR POR EL MOMENTO
app.get('/datos/reservarlugar', function (req, res) {

  // Reserva guardada
  fs.readFile(path.join(__dirname, 'diasDisponibles.json'), (err, data) => {
    if (err == undefined) {
      let jsonDatosDiasReserva = JSON.parse(data);
      res.send(jsonDatosDiasReserva)
    }
  })

})



//Server iniciado en puerto 4545
app.listen(4545, function(){
    console.log("Escuchando puerto 4545");
})*/