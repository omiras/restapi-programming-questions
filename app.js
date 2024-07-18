
// cargar el JSON en una variable
const questions = require('./questions.json');

// Importar el paquete de terceros que acabamos de instalar. Fijaos que como se encuentra en la carpeta node_modules NO hace falta especificar ninguna ruta (al igual que pasa con los built-in modules)
const express = require('express');
const logger = require('morgan');
const cors = require('cors');

const _ = require('lodash');

// Es generarme un objeto para gestionar el enrutamiento y otros aspectos de la aplicación
const app = express();
app.use(cors());

// Añadimos el middleware de morgan para loguear todas las peticiones que haga un cliente
app.use(logger('dev'));

// nos gustaría que también gestionaras los datos de tipo JSON (entre ellos los POST que nos lleguen)
app.use(express.urlencoded({ extended: true }));  // Middleware para parsear datos de formularios

// obtener el index.html
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});

// obtener una pregunta tipo test aleatoria
app.get("/api/v1/question/random", (req, res) => {

    // TODO!
    const question = _.sample(questions); //De Lodash
    res.send(question);
});

// obtener todas las categorías posibles ordenadas alfabeticamente
app.get("/api/v1/categories", (req, res) => {
    const categoryArr = questions.map(q => q.category);

   const uniqueValuesArr = _.uniq(categoryArr);

   const orderedArr = uniqueValuesArr.sort()
    
    res.send(orderedArr);
})

// Levantar el servidor
app.listen(process.env.PORT || 3000, () => {
    console.log("Servidor corriendo en el puerto 3000.");
});

