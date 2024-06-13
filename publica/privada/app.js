//DECLARO EXPRESS Y APP
const express = require('express');
const app = express();
//DECLARO EL PATH
const path = require('path');
//DECLARO EL PUERTO
const PORT = process.env.PORT || 4001;
// DECLARO EL BODY PARSER
const bodyParser = require('body-parser');
// DECLARO LAS RUTAS 
const rutas = require('./rutas.js');

// DECLARO EL TIPO DE MOTOR (EJS)
app.set('view engine', 'ejs');

// USAMOS EL BODY PARSER
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


//CREAMOS LA RUTA PATH EN LA CARPETA PUBLIC
app.use(express.static(path.join(__dirname, 'public')));
app.use(rutas);

// ARRANCAMOS EL PUERTO
app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});