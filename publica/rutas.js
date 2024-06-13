//IMPORTO MODULOS
const mysql = require("mysql");
const express = require("express");
const rutas = express.Router();
// CREO SESSION DE EXPRESS
const session = require("express-session");
// Configura el middleware de sesión
rutas.use(
  session({
    secret: "tu_secreto",
    resave: false,
    saveUninitialized: true,
  })
);
//IMPORTO LOS CONTROLADORES
const authentication = require('./public/controllers/authentication');


// CONFIGURO LOS DATOS DE LA BBDD
const configMySQL = {
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
};
//CREO LA CONEXION A LA BBDD
const connection = mysql.createConnection(configMySQL);



//OBTENGO LOS TIPOS PARA EL NAV
function obtenerTipos(callback) {
  const select = `SELECT tipo FROM modelos GROUP BY tipo`;
  connection.query(select, (err, result) => {
    if (err) {
      console.error(err);
      callback(err, null);
      return;
    }
    callback(null, result);
  });
}
//CREO LA RUTA RAIZ
rutas.get("/", (req, res) => {
  obtenerTipos((err, tipos) => {
    if (err) {
      return res.status(500).send("Error en la consulta a la base de datos");
    }
    

    // Guarda los tipos en la sesión
    req.session.tipos = tipos;

    const select = `SELECT * FROM modelos`;
    connection.query(select, (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Error en la consulta a la base de datos");
      }

      // Renderiza la plantilla "index" con los datos obtenidos
      res.render("index", {
        title: "Alquila-me el coche",
        tipos: tipos,
        data1: result,
      });
    });
  });
});
// CREO LA RUTA LOGIN 
rutas.get("/login", (req, res) => {
  res.render("login", {
    title: "Ingresa tus datos",
  });
});
// AQUI OBTENGO LOS DATOS DE LOGIN Y LOS COMPARO CON UNA CONSULTA A LA BBDD
rutas.post("/login", (req, res) => {
  const datos = req.body;
  const select = `SELECT * FROM clientes WHERE email = ? AND password = ?`;

  connection.query(select, [datos.email, datos.password], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error en la consulta a la base de datos");
    }

    let mensaje = ""; // Definimos un valor predeterminado para mensaje
    if (result.length > 0) {
      // Si hay resultados, el usuario ha ingresado credenciales válidas
      let usuario = req.session.usuario = {
        id: result[0].id_cliente,
        email: result[0].email
      };

      console.log("session dentro de login", usuario);
      mensaje = "¡Bienvenido!";
      
      res.render("bienvenido", {  // Corrección: la plantilla correcta es "bienvenido"
        title: "Ingresa tus datos",
        mensaje: mensaje,
        result: result
      });
    } else {
      // Si no hay resultados, el usuario ha ingresado credenciales inválidas
      mensaje = "Usuario o contraseña incorrectos";

      res.render("login", {  // Corrección: la plantilla correcta es "login"
        title: "Ingresa tus datos",
        mensaje: mensaje,
        result: result
      });
    }
  });
});

//CREO LA RUTA PARA REGISTRARSE
rutas.get("/register", (req, res) => {
  console.log("registro sin authenticar", req.body)
  res.render("register", {
    title: "Registrate!"
  });
});

// rutas.post("/register", authentication.register, (req, res) => {
//   console.log("registro con authentication", req.body)
//   res.render("register", {
//     title: "Registrate!"
//   });
// });

// OBTENGO LOS DATOS ENVIADOS POR EL FORMULARIO REGISTER Y LOS INSERTO EN LA BBDD
rutas.post('/register', (req, res) => {
  const datos = req.body;
  const insert = `INSERT INTO clientes (nombre, apellido, dni, tel, email, poblacio, password) VALUES (?, ?, ?, ?, ?, ?, ?)`;
  // console.log("Dentro de register")
  connection.query(insert, [datos.nombre, datos.apellido, datos.dni, datos.tel, datos.email, datos.poblacio, datos.password], (err, result, fields) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error en la consulta a la base de datos");
    }
    
    
    // console.log("Registro insertado correctamente");
    res.render('register', {
      title: 'Registrate!',
      mensaje: '¡Registro exitoso! Tu cuenta ha sido creada.'
    });
  });
});


//ESTO ES EXPERIMENTAL PARA VER SI PUEDO HACER LOGOUT, HACER RESERVAR Y EN SI UTILIZAR LA SESSION CREADA

// Ruta para cerrar sesión
rutas.get("/logout", (req, res) => {
  // Destruye la sesión
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
    }
    // Redirige al usuario a la página de inicio
    res.redirect("/login");
  });
});

// Middleware para verificar la sesión del usuario
function verificarSesion(req, res, next) {
  // Si la sesión del usuario no está presente, redirige al usuario a la página de inicio de sesión
  if (!req.session.usuario) {
    return res.redirect("/login");
  }
  // Si la sesión del usuario está presente, continúa con la siguiente función de middleware
  next();
}

// // Ejemplo de ruta protegida que requiere inicio de sesión
// rutas.get("/reservar", verificarSesion, (req, res) => {
//   // Aquí puedes realizar acciones específicas que solo usuarios autenticados pueden hacer
//   res.render("reservas", {
//     title: "Reservas",
//     usuario: req.session.usuario
//   });
// });

// // Ejemplo de otra ruta protegida
// rutas.get("/perfil", verificarSesion, (req, res) => {
//   // Aquí puedes mostrar el perfil del usuario, acceder a sus reservas, etc.
//   res.render("perfil", {
//     title: "Perfil",
//     usuario: req.session.usuario
//   });
// });

rutas.post("/reservar", (req, res) => {
    const datos = req.body;
    const id = req.params.id;
    console.log(id);
    console.log(datos);

})

// AQUI CREO UNA RUTA PARA RESERVAR COCHES, DONDE ENVIO EL ID DEL COCHE SELECCIONADO
rutas.get("/reservar:id", verificarSesion, (req, res) => {
  const id = req.params.id;
  // // Accede a los tipos desde la sesión
  const tipos = req.session.tipos || [];

  const select = `SELECT * FROM modelos WHERE id_modelo = ?`;
  connection.query(select, [id], (err, result, fields) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error en la consulta a la base de datos");
    }

    res.render("reservar", {
      title: "Reserva el coche",
      data1: result,
      tipos: tipos,
    });
  });
});





// AQUI CREO RUTAS DINAMICAS PARA LOS TIPOS, PARA DESPLAZARME EN EL NAV
// Y PARA QUE SE ACTUALIZE EL NAV AUTOMATICO CUANDO ACTUALIZO LA BBDD
rutas.get("/:tipo", (req, res) => {
  const tipoSeleccionado = req.params.tipo;
  // Accede a los tipos desde la sesión
  const tipos = req.session.tipos || [];

  const select = `SELECT * FROM modelos WHERE tipo = ?`;
  connection.query(select, [tipoSeleccionado], (err, result, fields) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error en la consulta a la base de datos");
    }
    res.render("tipo", {
      title: `Alquila ${tipoSeleccionado}`,
      data1: result,
      tipos: tipos,
    });
  });
});

//AQUI CREO DOS RUTAS DINAMICAS DONDE VEO LOS DATOS ESPECIFICOS DEL MODELO SELECCIONADO
rutas.get("/:tipo/:nombre", (req, res) => {
  const nombreSeleccionado = req.params.nombre;
  const tipos = req.session.tipos || [];

  const select = `SELECT * FROM modelos WHERE nombre_modelo = ?`;
  connection.query(select, [nombreSeleccionado], (err, result, fields) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error en la consulta a la base de datos");
    }
    res.render("modelo", {
      title: `Alquila tu ${nombreSeleccionado}`,
      data1: result,
      tipos: tipos,
    });
    // console.log("tipos modelos:", tipos);
  });
});

//AQUI EXPORTO EL MODULO, PARA PODER USARLO EN APP.JS
module.exports = rutas;
