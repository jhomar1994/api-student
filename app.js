// app.js
const express = require("express");
const bodyParser = require("body-parser");
const db = require("./db");   // 👈 importamos db.js

const app = express();
const PORT = 8000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// --- Rutas usando db ---
// Crear estudiante
app.post("/students", (req, res) => {
  const { firstname, lastname, gender, age } = req.body;
  db.run(
    "INSERT INTO students (firstname, lastname, gender, age) VALUES (?, ?, ?, ?)",
    [firstname, lastname, gender, age],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: this.lastID, firstname, lastname, gender, age });
    }
  );
});

// Leer todos
app.get("/students", (req, res) => {
  db.all("SELECT * FROM students", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Leer uno
app.get("/student/:id", (req, res) => {
  db.get("SELECT * FROM students WHERE id = ?", [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: "Estudiante no encontrado" });
    res.json(row);
  });
});

// Actualizar
app.put("/student/:id", (req, res) => {
  const { firstname, lastname, gender, age } = req.body;
  db.run(
    "UPDATE students SET firstname=?, lastname=?, gender=?, age=? WHERE id=?",
    [firstname, lastname, gender, age, req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ error: "Estudiante no encontrado" });
      res.json({ id: req.params.id, firstname, lastname, gender, age });
    }
  );
});

// Eliminar
app.delete("/student/:id", (req, res) => {
  db.run("DELETE FROM students WHERE id=?", [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: "Estudiante no encontrado" });
    res.json({ message: "Estudiante eliminado correctamente" });
  });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
