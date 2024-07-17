
// Importar el paquete de terceros que acabamos de instalar. Fijaos que como se encuentra en la carpeta node_modules NO hace falta especificar ninguna ruta (al igual que pasa con los built-in modules)
const express = require('express');
const logger = require('morgan');


// Es generarme un objeto para gestionar el enrutamiento y otros aspectos de la aplicación
const app = express();

// Añadimos el middleware de morgan para loguear todas las peticiones que haga un cliente
app.use(logger('dev'));

// nos gustaría que también gestionaras los datos de tipo JSON (entre ellos los POST que nos lleguen)
app.use(express.urlencoded({ extended: true }));  // Middleware para parsear datos de formularios

// obtener una pregunta tipo test aleatoria
app.get("/api/v1/question/random", (req, res) => {
    res.send("ok");
});

// Levantar el servidor
app.listen(process.env.PORT || 3000, () => {
    console.log("Servidor corriendo en el puerto 3000.");
});

