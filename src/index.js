import express from "express";
import "dotenv/config";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  try {
    return res.json({ message: "Hello from server 🖐️", status: 200 });
  } catch (error) {
    return res.json({ message: error.message, status: 504 });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
