const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const DB_FILE = "codes.json";

// Leer base de datos
function readDB() {
  return JSON.parse(fs.readFileSync(DB_FILE));
}

// Guardar base de datos
function saveDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// LOGIN
app.post("/login", (req, res) => {
  const { code } = req.body;

  let db = readDB();

  let found = db.find(c => c.code === code && !c.used);

  if (!found) {
    return res.json({ success: false });
  }

  found.used = true;
  saveDB(db);

  res.json({ success: true });
});

// CONTADOR
app.get("/remaining", (req, res) => {
  let db = readDB();
  let remaining = db.filter(c => !c.used).length;

  res.json({ remaining });
});

// 🔥 IMPORTANTE PARA RENDER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Servidor activo 🔥"));