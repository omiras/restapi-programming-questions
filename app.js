// cargar el JSON en una variable
const questions = require("./questions.json");

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
app.use(logger("dev"));

// nos gustaría que también gestionaras los datos de tipo JSON (entre ellos los POST que nos lleguen)
app.use(express.urlencoded({ extended: true })); // Middleware para parsear datos de formularios

const limiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000,
  max: 2, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// app.use(limiter);

// obtener el index.html
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

function getRandomQuestion(req, res) {
  (req, res) => {
    // TODO!
    const { category } = req.query;
    let multipleCategoryQuestions = []
    console.log(category)
    const question = () => {
      if (category) {
        if (category.includes(',')) {
          const categoryArr = category.split(',');
          multipleCategoryQuestions = questions.filter(q => {

            for (i = 0; i < categoryArr.length; i++) {
              if (q.category == categoryArr[i]) {
                return true;
              }
            }
          })
          console.log(multipleCategoryQuestions)
          const randomMultipleCategoryQuestion = _.sample(multipleCategoryQuestions);
          return randomMultipleCategoryQuestion;
        } else {
          const categoryQuestions = questions.filter(
            (q) => q.category.toLowerCase() == category.toLowerCase()
          );
          const randomCategoryQuestion = _.sample(categoryQuestions);
          return randomCategoryQuestion;
        }

      } else {
        const randomQuestion = _.sample(questions); //De Lodash
        return randomQuestion;
      }
    }

    res.send(question());
  }
}

// obtener una pregunta tipo test aleatoria
app.get("/api/v1/question/random", getRandomQuestion);

// obtener una pregunta tipo test aleatoria (ahora con más bugs)
app.get("/api/v2beta/question/random", (req, res) => {

  const errorChance = Math.random();

  if (errorChance < 0.9) {
    return res.status(503).send('There is high demmand in our API right now. Try again later...');
  }

  getRandomQuestion();

});

// obtener todas las categorías posibles ordenadas alfabeticamente
app.get("/api/v1/categories", (req, res) => {
  const categoryArr = questions.map((q) => q.category);
  const uniqueValuesArr = _.uniq(categoryArr);
  const orderedArr = uniqueValuesArr.sort();
  res.send(orderedArr);
});


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
app.patch('/api/v1/question/:id/downvote', limiter, (req, res) => {
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
})

// Levantar el servidor
app.listen(process.env.PORT || 3000, () => {
  console.log("Servidor corriendo en el puerto 3000.");
});
