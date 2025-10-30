import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/direct-download", async (req, res) => {
  const fileUrl = req.query.url;
  if (!fileUrl) return res.status(400).send("No URL provided");

  try {
    const response = await fetch(fileUrl);
    if (!response.ok) return res.status(500).send("Could not fetch file.");

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${path.basename(fileUrl.split("?")[0]) || "file"}"`
    );
    res.setHeader("Content-Type", response.headers.get("content-type") || "application/octet-stream");

    response.body.pipe(res);
  } catch (err) {
    res.status(500).send("Download failed: " + err.message);
  }
});

app.listen(3000, () => console.log("Server running → http://localhost:3000"));
