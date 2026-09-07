import express from "express";
import "dotenv/config";
import swaggerUi from "swagger-ui-express"

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const tasks = [
  { id: 1, title: "Learn Express", done: true },
  { id: 2, title: "Build a REST API", done: false },
  { id: 3, title: "Deploy to production", done: false },
];

// Swagger/OpenAPI specification
const openapiSpec = {
  openapi: "3.0.0",
  info: {
    title: "Task API",
    version: "1.0",
    description: "A simple CRUD API for tasks",
  },
  paths: {
    "/": {
      get: {
        summary: "API information",
        description: "Returns the API name, version, and available endpoints",
        responses: {
          200: {
            description: "API information",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    version: { type: "string" },
                    endpoints: {
                      type: "array",
                      items: { type: "string" },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/health": {
      get: {
        summary: "Health check",
        description: "Returns the server health status",
        responses: {
          200: {
            description: "Server is healthy",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", enum: ["ok"] },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/tasks": {
      get: {
        summary: "Get all tasks",
        description: "Returns an array of all tasks",
        responses: {
          200: {
            description: "A list of tasks",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/Task",
                  },
                },
              },
            },
          },
        },
      },
      post: {
        summary: "Create a new task",
        description: "Creates a new task with the provided title",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["title"],
                properties: {
                  title: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "Task created",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Task",
                },
              },
            },
          },
          400: {
            description: "Invalid input",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    error: { type: "string" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/tasks/{id}": {
      get: {
        summary: "Get a task by ID",
        description: "Returns a single task by its ID",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
          },
        ],
        responses: {
          200: {
            description: "A single task",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Task",
                },
              },
            },
          },
          404: {
            description: "Task not found",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    error: { type: "string" },
                  },
                },
              },
            },
          },
        },
      },
      put: {
        summary: "Update a task by ID",
        description: "Updates a task's title and/or done status",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  done: { type: "boolean" },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Task updated",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Task",
                },
              },
            },
          },
          400: {
            description: "Invalid input",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    error: { type: "string" },
                  },
                },
              },
            },
          },
          404: {
            description: "Task not found",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    error: { type: "string" },
                  },
                },
              },
            },
          },
        },
      },
      delete: {
        summary: "Delete a task by ID",
        description: "Deletes a task by its ID",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
          },
        ],
        responses: {
          204: {
            description: "Task deleted successfully",
          },
          404: {
            description: "Task not found",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    error: { type: "string" },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      Task: {
        type: "object",
        properties: {
          id: {
            type: "integer",
            description: "The unique identifier of the task",
          },
          title: {
            type: "string",
            description: "The title of the task",
          },
          done: {
            type: "boolean",
            description: "Whether the task is completed",
          },
        },
        required: ["id", "title", "done"],
      },
    },
  },
};

// Serve Swagger UI
app.use("/docs", swaggerUi.serve, swaggerUi.setup(openapiSpec));

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
  return res.json(task);
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
