## Introducción

Durante mucho tiempo, Linkedin ha ofrecido una funcionalidad que te permitía contestar un conjunto de preguntas durante un tiempo determinado sobre una habilidad específica (html, css, git, etc) - [vídeo](https://www.youtube.com/watch?v=JYcJyAU5AM4)

Desde 2024 han eliminado esta funcionalidad. Es posible a que sea debido que ahora ocn Chat GPT cualquiera puede pasar estos tests…

Sin embargo, aún a día de hoy se puede encontrar una base de conocimiento sobre las preguntas tipo test que aparecían en dichos ejercicios, por ejemplo, en este [repo](https://github.com/Ebazhanov/linkedin-skill-assessments-quizzes)

Queremos crear una REST API de manera que ofrezcamos a cualquier cliente la posibilidad de obtener preguntas tipo tests con su correspondiente opción correcta.

## Iteración 1

Explora el repositorio https://github.com/Ebazhanov/linkedin-skill-assessments-quizzes. Fíjate que todas las preguntas estan en formato Markdown. Vamos a crear un JSON (o varios) con los conceptos que hemos dado en el curso ya. Estos son:

- css
- git
- html
- javascript
- json

Debemos pensar el formato JSON el que vamos a almacenar la información de cada pregunta tipo test. Piensa que información debería tener cada objeto de este JSON para representar toda la información de la que se compone cada pregunta.

```
{
   "id": "123",
   "question" : {
      "text": "Which operator returns true if the two compared values are not equal?",
      "code": "function addTax(total) {
                 return total * 1.05;}",
      "imageURL:": "https://.......",
      
   }
   "incorrectAnswers": ["", "", ""],
   "correctAnswer": "",
   "referencesLink": "https://www.w3schools.com/js/js_operators.asp",
   "referencesText": "Reference Javascript Comparison Operators",
   "category": "javascript",
   
}
```

## Iteración 2: Obtener pregunta tipo test

Obtiene una pregunta tipo test aleatoria.

`GET /api/v1/question/random`

Obtiene todas las categorías posibles ordenadas alfabeticamente.

`GET /api/v1/categories`

`['css', 'git' 'javascript', 'html', 'json']`

Obtiene una pregunta tipo test y ordena de forma aleatoria sobre HTML 

`GET /api/v1/question/random?category=html`

Amplia la funcionalidad para obtener una prgunta tipo test de forma aleatoria sobre diferentes categorías separadas por comas

`GET /api/v1/question/random?category=html,css,javascript`

Permite obtener un conjunto de preguntas tipo test **sin que se repitan**. 
Importante: el valor de _amount_ no puede ser menor a 1 ni mayor de 15.
En caso de que se haga una petición GET que no cumpla el requisito anterior debemos devolver un error 400 con un mensaje.

`GET /api/v1/question/random?category=html,css,javascript&amount=5`

## Iteración 3: Votar una pregunta tipo test

Vamos a permitir que el usuario vote positiva o negativamente nuestras preguntas tipo test. Si vota positiva sumara en 1 su popularidad, y -1 en caso de que vote negativo. La petición debe ser de tipo PATCH

El primer endpoint votará positivamente una pregunta mientras que el segundo la votará negativamente. 

```
/api/v1/question/:id/upvote
/api/v1/question/:id/downvote
```

Si no existe, debemos añadir un campo al objeto JSON con el valor total de votaciones recibidos:

```
{
   "id": 2,
   ....,
   "popularity": 31
}

```

### Iteración 3.1: Seguridad

No queremos que la misma IP vote demasiado seguido una misma pregunta. Investiga como usar Express para que limite el número de peticiones a este endpoint. Es decir que un mismo cliente solo pueda hacer una petición cada 24 horas, por ejemplo.

## Iteración 4: Sugerir nuevas preguntas tipo test

Vamos a permtir que los usuarios envien peticiones para crear nuevas preguntas tipo test. Crea un endpoint de tipo POST para recibir dichas preguntas.

`POST /api/v1/question/new`

El usuario debe enviar un JSON con los campos suficientes para crear la pregunta tipo test. Ejemplo del cuerpo de la petición POST: 

```
{
    "question": {
        "text": "¿Cuál es la diferencia principal entre `==` y `===` en JavaScript?",
        "code": "",
        "imageURL": ""
    },
    "incorrectAnswers": [
        "`==` compara tanto el valor como el tipo, mientras que `===` solo compara el valor.",
        "`==` compara dos valores estrictamente, mientras que `===` compara dos valores sin tener en cuenta el tipo.",
        "`==` y `===` son equivalentes en todos los contextos."
    ],
    "correctAnswer": "`===` compara tanto el valor como el tipo, mientras que `==` solo compara el valor.",
    "referencesLink": "https://www.w3schools.com/js/js_comparisons.asp",
    "referencesText": "JavaScript Comparison Operators",
    "category": "javascript"
}
```



No podemos agregar directamente estas preguntas al JSON, hay que validarlas previamente.

Para ellos podemos implementar varias opciones

- Al recibir la petición guardamos la propuesta de pregunta en un fichero JSON para comprobarlo más tarde
- Al recibir la petición enviamos un correo electrónico al administrador de esta API (nosotros?).

## Iteración continua: Documentar la API

Modifica el fichero '/views/index.html' para agregar cada una de las funcionalidades que vas implementando siguiendo la estructura de la página Web






