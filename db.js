// db.js
const sqlite3 = require("sqlite3").verbose();

// Crear conexión a la base de datos
const db = new sqlite3.Database("./students.db", (err) => {
  if (err) {
    console.error("Error al conectar con SQLite:", err.message);
  } else {
    console.log("Conectado a SQLite.");
  }
});

// Crear tabla si no existe
db.run(`
  CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    firstname TEXT NOT NULL,
    lastname TEXT NOT NULL,
    gender TEXT NOT NULL,
    age INTEGER NOT NULL
  )
`);

module.exports = db;
