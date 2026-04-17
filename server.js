const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// 🔐 códigos
let codes = ["VIP1", "VIP2", "VIP3", "VIP4", "VIP5"];
let usedCodes = [];

// 👥 accesos restantes
app.get("/remaining", (req, res) => {
  res.json({ remaining: codes.length - usedCodes.length });
});

// 🔐 login
app.post("/login", (req, res) => {
  const { code } = req.body;

  if (codes.includes(code) && !usedCodes.includes(code)) {
    usedCodes.push(code);
    return res.json({ success: true });
  }

  res.json({ success: false });
});

// 🎧 streaming
app.get("/stream/:id", (req, res) => {
  const id = req.params.id;
  const filePath = `tracks/track${id}.mp3`;

  if (!fs.existsSync(filePath)) {
    return res.status(404).send("No existe");
  }

  const stat = fs.statSync(filePath);
  const start = 0;
  const end = Math.min(stat.size, 500000);

  res.writeHead(206, {
    "Content-Type": "audio/mpeg",
    "Content-Range": `bytes ${start}-${end}/${stat.size}`,
    "Accept-Ranges": "bytes",
    "Content-Length": end - start
  });

  fs.createReadStream(filePath, { start, end }).pipe(res);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor corriendo");
});