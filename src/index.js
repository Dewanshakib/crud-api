import express from "express";
import "dotenv/config";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  return res.json({
    name: "Task API",
    version: "1.0",
    endpoints: ["/tasks"],
  });
});

app.get("/health", (req, res) => {
  return res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
