import express from "express";
import "dotenv/config";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const tasks = [
  { id: 1, title: "Learn Express", done: true },
  { id: 2, title: "Build a REST API", done: false },
  { id: 3, title: "Deploy to production", done: false },
];

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

app.get("/tasks", (req, res) => {
  return res.json(tasks);
});

app.get("/tasks/:id", (req, res) => {
  const taskId = parseInt(req.params.id);
  const task = tasks.find((t) => t.id === taskId);
  if (!task) {
    return res.status(404).json({ error: `Task ${taskId} not found` });
  }
  return res.json(task);
});

app.post("/tasks", (req, res) => {
  const { title } = req.body;
  if (!title || title.trim() === "") {
    return res.status(400).json({ error: "title is required" });
  }
  const nextId = tasks.length + 1;
  const newTask = { id: nextId, title: title.trim(), done: false };
  tasks.push(newTask);
  return res.status(201).json(newTask);
});

app.put("/tasks/:id", (req, res) => {
  const taskId = parseInt(req.params.id);
  const task = tasks.find((t) => t.id === taskId);
  if (!task) {
    return res.status(404).json({ error: `Task ${taskId} not found` });
  }
  const { title, done } = req.body;

  if (!title || title.trim() === "") {
    return res.status(400).json({ error: "title must be a non-empty string" });
  }

  if (done !== undefined) {
    if (typeof done !== "boolean") {
      return res.status(400).json({ error: "done must be a boolean" });
    }
    task.done = done;
  }
  return res.status(201).json(task);
});

app.delete("/tasks/:id", (req, res) => {
  const taskId = parseInt(req.params.id);
  const idx = tasks.findIndex((t) => t.id === taskId);
  if (idx === -1) {
    return res.status(404).json({ error: `Task ${taskId} not found` });
  }
  tasks.splice(idx, 1);
  return res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
