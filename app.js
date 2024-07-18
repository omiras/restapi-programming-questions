
// cargar el JSON en una variable
const questions = require('./questions.json');

// Importar el paquete de terceros que acabamos de instalar. Fijaos que como se encuentra en la carpeta node_modules NO hace falta especificar ninguna ruta (al igual que pasa con los built-in modules)
const express = require('express');
const rateLimit = require('express-rate-limit');
const logger = require('morgan');
const cors = require('cors');

const _ = require('lodash');
const fs = require('fs')

// Es generarme un objeto para gestionar el enrutamiento y otros aspectos de la aplicación
const app = express();
app.use(cors());

// Añadimos el middleware de morgan para loguear todas las peticiones que haga un cliente
app.use(logger('dev'));

// nos gustaría que también gestionaras los datos de tipo JSON (entre ellos los POST que nos lleguen)
app.use(express.urlencoded({ extended: true }));  // Middleware para parsear datos de formularios

const limiter = rateLimit({
    windowMs: 24 * 60 * 60 * 1000, 
    max: 2, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.use(limiter);

// obtener el index.html
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});

// obtener una pregunta tipo test aleatoria
app.get("/api/v1/question/random", (req, res) => {

    // TODO!
    const question = _.sample(questions);
    res.send(question);
});

/**
// Endpoint para GET PREGUNTA POR ID
app.get('/api/v1/question/:id/upvote', (req, res) => {
    const id = req.params.id;
    console.log("I'm the ID", id);

    //const question = questions.find(q => q == "popularity");
    //console.log("I'm the question", question);

    // Leer y parsear el archivo JSON 
    fs.readFile('./questions.json', 'utf8', (err, data) => { 
        if (err) { console.error('Error al leer el archivo JSON:', err); 
            return; } 
        try { 
            const jsonData = JSON.parse(data); 
    // Buscar una propiedad en el JSON 
    if ('popularity' in jsonData) 
    { 
        jsonData.popularity += 1;
    } 
    else { 
        jsonData.popularity = 1;
    } 
    } catch (error) { console.error('Error al parsear el JSON:', error); }
/** 
    if(question) {
        res.status(200).send(question);
    } else {
        res.status(404).send("Question not found")
    }
        })
})
*/    

// Endpoint upvote
app.patch('/api/v1/question/:id/upvote', limiter, (req, res) => {
    const id = req.params.id;
    const question = questions.find(q => q.id === id);

    if (question) {
        if (!question.hasOwnProperty('popularity')) {
            question.popularity = 0;
        }
        question.popularity += 1;
        // Guardar los cambios en el archivo questions.json
        fs.writeFileSync('./questions.json', JSON.stringify(questions, null, 2));
        res.status(200).send({ message: 'Upvoted successfully', question });
    } else {
        res.status(404).send({ message: 'Question not found' });
    }
});

// Endpoint para cuando el usuario vote negativo
app.patch('/api/v1/question/:id/downvote', limiter, (req,res) => {
    const id = req.params.id;
    const question = questions.find(q => q.id === id);

    if (question) {
        if (!question.hasOwnProperty('popularity')) {
            question.popularity = 0;
        }
        question.popularity -= 1;
        // Guardar los cambios en el archivo questions.json
        fs.writeFileSync('./questions.json', JSON.stringify(questions, null, 2));
        res.status(200).send({ message: 'Downvoted successfully', question });
    } else {
        res.status(404).send({ message: 'Question not found' });
    }
} )


// Levantar el servidor
app.listen(process.env.PORT || 3000, () => {
    console.log("Servidor corriendo en el puerto 3000.");
});

