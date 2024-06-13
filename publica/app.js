// Cargar los módulos
const express = require('express');
const session = require('express-session');
const app = express();
// Imporatado las rutas
const rutas = require('./rutas')
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3001;
const path = require('path');

app.set('view engine', 'ejs');
// app.set("views", __dirname + "/views") 

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use(express.static(path.join(__dirname, 'public')));
app.use(rutas);


app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto: http://localhost:${PORT}`);
});

 