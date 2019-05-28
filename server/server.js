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
app.get("/", function(req, res) {
  console.log("Entre al home con handlebars")

  if(req.session.userId !== undefined) {
    const datosUsuarioLogueado = {
      nombre: req.session.userNombre,
      email: req.session.email,
      residencia: req.session.residencia
        }
//Esa es la vista del usuario logueado
      res.render("home", {
      data: datosUsuarioLogueado
      
      });

      } else {
        //Es la vista de usuario no logueado
        res.render('home')
      }

});

//GET
//Ingreso a la login
app.get('/login', function (req, res) {
  console.log("Entre al login");
  res.sendFile(path.join(__dirname, '../client/html/login.html'));
})



//Ingreso a recorrido
app.get("/recorrido", function(req, res) {
  console.log("Entre a recorrido con handlebars")

  if(req.session.userId !== undefined) {
    const datosUsuarioLogueado = {
      nombre: req.session.userNombre,
      email: req.session.email,
      residencia: req.session.residencia
        }
//Esa es la vista del usuario logueado
      res.render("recorrido", {
      data: datosUsuarioLogueado
      
      });

      } else {
        //Es la vista de usuario no logueado
        res.render('recorrido')
      }

});

//Ingreso a empresa
app.get("/empresa", function(req, res) {
  console.log("Entre a empresa con handlebars")

  if(req.session.userId !== undefined) {
    const datosUsuarioLogueado = {
      nombre: req.session.userNombre,
      email: req.session.email,
      residencia: req.session.residencia
        }
//Esa es la vista del usuario logueado
      res.render("empresa", {
      data: datosUsuarioLogueado
      
      });

      } else {
        //Es la vista de usuario no logueado
        res.render('empresa')
      }
  
});

//Ingreso a calendario
app.get("/calendario", function(req, res) {
  console.log("Entre a calendario con handlebars")

  if(req.session.userId !== undefined) {
    const datosUsuarioLogueado = {
      nombre: req.session.userNombre,
      email: req.session.email,
      residencia: req.session.residencia
        }
//Esa es la vista del usuario logueado
      res.render("calendario", {
      data: datosUsuarioLogueado
      
      });

      } else {
        //Es la vista de usuario no logueado
        res.render('calendario')
      }
  
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
    if(req.session.userId !== undefined) {
      const datosUsuarioLogueado = {
        nombre: req.session.userNombre,
        email: req.session.email,
        residencia: req.session.residencia
          }
        //Vista del usuario logueado
        res.render("reserva", {
        data: datosUsuarioLogueado,
        datosIda: datosIda,
        datosVuelta: datosVuelta
        
        });
  
        } else {
          //Vista de usuario no logueado
          res.render("reserva", {
            //Asigno una etiqueta 'datosLugares' para usar los datos del array que traigo de la colección
            datosIda: datosIda,
            datosVuelta: datosVuelta
          });
        }

    });

  });

  });
});



//Ingreso a usuario con Mongodb
app.get("/usuario", function(req, res) {
  
  if(req.session.userId !== undefined) {
    const datosUsuarioLogueado = {
      nombre: req.session.userNombre,
      email: req.session.email,
      residencia: req.session.residencia
        }

      res.render("usuario", {
          data: datosUsuarioLogueado
      });

      } else {
        res.redirect('/registro.html')
      }
 
    });




//POST / Login 
app.post('/login/form', (req, res) => {

  const nombre = req.body.user;
  const password = req.body.password;


client.connect(function(error, client) {
  // Insertamos la base de datos que usaremos
  const db = client.db("expressdb");

  //Indicamos la colección donde se van a agregar los datos de login
  let coleccionUsuarios = db.collection("usuarios");

  coleccionUsuarios.find({nombre: nombre, password: password}).toArray(function(err, datosLogin) {
    console.log(datosLogin);

    if(datosLogin.length == 1) {
    console.log("Estoy logueado");

    req.session.userId = datosLogin[0]._id;
    req.session.userNombre = datosLogin[0].nombre;
    req.session.email = datosLogin[0].email;
    req.session.residencia = datosLogin[0].residencia;

    res.redirect('/');

    }else{
      res.redirect('/login')
      console.log("No me loguee")
    }
    
  })
})

});


//GET logout
app.get('/logout', (req, res) => {
  //Sale de sesión y redirijo al login
  req.session.destroy();
  res.redirect("/");
})




//Ruta para registro
app.post('/registro/form', (req, res) => {
  
  const usuarioNuevo = {
    nombre: req.body.user,
    email: req.body.email,
    residencia: req.body.residencia,
    password: req.body.password
  }
  console.log(usuarioNuevo)

  client.connect(function(err, client) {
    const db = client.db("expressdb");

    let coleccionUsuarioNuevo = db.collection("usuarios");

    coleccionUsuarioNuevo.insertOne(usuarioNuevo, (err, datoCreado) => {
      res.redirect('/login')
    })

  })

} )




//Server iniciado en puerto 4545
app.listen(4545, function(){
    console.log("Escuchando puerto 4545");
})



/*
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
*/