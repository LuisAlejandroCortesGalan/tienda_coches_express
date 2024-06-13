// DECLARO MYSQL
const mysql = require("mysql");
//DECLARO EXPRESS
const express = require("express");
//DECLARO LAS RUTAS DE EXPRESS
const rutas = express.Router();

//DECLARO LOS DATOS DE .ENV
const configMySQL = {
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
};

// CREAO LA CONECCION DE MYSQL
const connection = mysql.createConnection(configMySQL);

function calcularFacturacion(id) {
  const select = `SELECT SUM(facturacion) as facturas FROM alquileres where id_modelo = ?`;
  return new Promise((resolve, reject) => {
    connection.query(select, [id], (err, result, fields) => {
      if (err) {
        // handle error
        return reject(err);
      }
      // console.log("este essss", result);
      resolve(result[0].facturas || 0);
    });
  });
}

rutas.get("/", async (req, res, next) => {
  const select = `SELECT * FROM modelos`;
  connection.query(select, async (err, result, fields) => {
    if (err) {
      // handle error
      return next(err);
    }
    const datosFacturacion = result.map(async (row) => {
      const facturacion = await calcularFacturacion(row.id_modelo);
      //   console.log("esta es la facturacioncoño", facturacion);
      row.facturacion = facturacion;
      return row;
    });
    const datosFinal = await Promise.all(datosFacturacion);

    res.render("index", {
      title: `Tabla de coches`,
      data: datosFinal,
    });
    // console.log("datos psssrs", datosFinal);
  });
});

rutas.get('/formulario', (req, res) => {
  const {
    tipo,
    id_modelo,
    nombre_modelo,
    unidades_totales,
    unidades_alquiladas,
    personas,
    precioDia,
    puertas,
    cambio,
    maletas,
  } = req.query;

  res.render('formulario', { title: "Editar los datos",
    tipo,
    id_modelo,
    nombre_modelo,
    unidades_totales,
    unidades_alquiladas,
    personas,
    precioDia,
    puertas,
    cambio,
    maletas,
  });
});

rutas.post("/editar", (req, res) => {
  // Obtener los datos del formulario desde req.body
  const {
    tipo,
    id_modelo,
    nombre_modelo,
    unidades_totales,
    unidades_alquiladas,
    personas,
    precioDia,
    puertas,
    cambio,
    maletas,
  } = req.body;
  // console.log("valores recuperados" , req.body);

  const updateQuery = `UPDATE modelos SET tipo = ?, nombre_modelo = ?, unidades_totales = ?, unidades_alquiladas = ?, personas = ?, precioDia = ?, puertas = ?, cambio = ?, maletas = ? WHERE id_modelo = ?`;

  const values = [
    tipo,
    nombre_modelo,
    unidades_totales,
    unidades_alquiladas,
    personas,
    precioDia,
    puertas,
    cambio,
    maletas,
    id_modelo,
  ];
// console.log("Valores introducidos", values);
  // Ejecutar la consulta
  connection.query(updateQuery, values, (error, results, fields) => {
    if (error) {
      console.error("Error al actualizar los datos:", error);
      return res.status(500).send("Error al actualizar los datos");
    }
    res.redirect("/");
  });
});



rutas.post("/borrar/:id", (req, res) => {
  // Obtener los datos del formulario desde req.body
  const id = req.params.id;
  const deleteQuery = `DELETE FROM modelos WHERE id_modelo = ?`;  
  // Ejecutar la consulta
  connection.query(deleteQuery, [id], (error, results, fields) => {
    if (error) {
      console.error("Error al borrar la fila:", error);
      return res.status(500).send("Error al borrar la fila");
    }
    res.redirect("/");
  });
});



rutas.get('/ingresar', (req, res) => {
  res.render(`ingresar`, { title: "Ingresar los datos" });
});

rutas.post('/ingresar', (req, res) => {
  // Obtener los datos del formulario desde req.body
  const {
    id_modelo,
    nombre_modelo,
    unidades_totales,
    unidades_alquiladas,
    personas,
    puertas,
    cambio,
    maletas,
    tipo,
    precioDia
  } = req.body;

  // Crear la consulta de inserción
  const insertQuery = `
    INSERT INTO modelos (id_modelo, nombre_modelo, unidades_totales, unidades_alquiladas, personas, puertas, cambio, maletas, tipo, precioDia) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  // Ejecutar la consulta
  connection.query(insertQuery, [
    id_modelo,
    nombre_modelo,
    unidades_totales,
    unidades_alquiladas,
    personas,
    puertas,
    cambio,
    maletas,
    tipo,
    precioDia
  ], (error, results, fields) => {
    if (error) {
      console.error('Error al insertar los datos:', error);
      return res.status(500).send('Error al insertar los datos');
    }
    res.redirect('/');
  });
});



module.exports = rutas;
