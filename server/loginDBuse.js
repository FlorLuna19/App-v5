// Exporto las dos funciones en el objeto module.exports
module.exports.consultaUsuarios = consultaUsuarios;
module.exports.loginUsuario = loginUsuario;
//module.exports.deleteOne = deleteOne;

//Libreria de Mongodb
const mongodb = require('mongodb');

//MongoClient
const MongoClient = mongodb.MongoClient;
const mongoURL = 'mongodb://localhost: 27017';
const dbName = "expressdb";


//Función que consulta todos los usuarios de la base de datos "expressdb"
function consultaUsuarios() {
    MongoClient.connect(mongoURL, { useNewUrlParser: true }, (err, client) => {

        if (err) {            
            // Error en la conexión
            console.log("No se pudo conectar a la DB. " + err);
        } else {

            // Me traigo un objeto que apunte a la db "expressdb"
            const db = client.db(dbName);

            // Me traigo un objeto que apunte a la colección "usuarios"
            const collection = db.collection("nombre");

            // Consulto TODOS los elementos de la colección, los convierto en Array y los paso al render
            collection.find().toArray((err, list) => {
                if (err) {
                    cbError("Error al consultar nombres. " + err);
                } else {
                    cbDataReady(list);
                }
            });
        }

        // Cierro la conexión
        client.close();
    });
}


//Funcion que conecta al usuario
function loginUsuario(cbDataReady, cbError) {

    MongoClient.connect(mongoURL, { useNewUrlParser: true }, (err, client) => {

        if (err) {            
            // Error en la conexión
            cbError("No se pudo conectar a la DB. " + err);
        } else {

            // Me traigo un objeto que apunte a la db "expressdb"
            const db = client.db(dbName);

            // Me traigo un objeto que apunte a la colección "usuarios"
            const collection = db.collection("usuarios");

            // Consulto TODOS los elementos de la colección, los convierto en Array y los paso al render
            collection.find().toArray((err, list) => {
                if (err) {
                    cbError("Error al consultar nombres " + err);
                } else {
                    cbDataReady(list);
                }
            });
        }

        // Cierro la conexión
        client.close();
    });
}