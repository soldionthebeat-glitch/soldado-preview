app.get("/stream/:id", (req, res) => {
  const id = req.params.id;

  const filePath = `tracks/track${id}.mp3`;

  if (!fs.existsSync(filePath)) {
    return res.status(404).send("No existe");
  }

  const stat = fs.statSync(filePath);

  const start = 0;
  const end = Math.min(stat.size, 500000); // 🔥 limita duración

  res.writeHead(206, {
    "Content-Type": "audio/mpeg",
    "Content-Range": `bytes ${start}-${end}/${stat.size}`,
    "Accept-Ranges": "bytes",
    "Content-Length": end - start
  });

  fs.createReadStream(filePath, { start, end }).pipe(res);
});