import express from 'express';

const app = express();

app.use(express.json());

const db = {};

const generateId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

// API endpoint to create a todo
// assumption (auth middleware)
app.post("/api/todos", (req, res) => {
  const { title, content } = req.body;

  // validation (middleware)
  if (!title || !content) {
    return res.status(400).json({ message: "Both title and content are required." });
  }

  // await and save ticket into database
  const id = generateId();
  db[id] = { title, content };

  // publisher (todo-created)

  res.status(201).json({
    message: "Todo was created",
    event: {
      topic: "todo-created",
      todo: {
        id, ...db[id]
      }
    },
    todo: { id, ...db[id] }
  });
});

// API endpoint to get all todos
// assumption (auth middleware) if applicable
app.get("/api/todos", (req, res) => {
  if (Object.keys(db).length === 0) {
    return res.status(404).json({ message: "Currently no todos." });
  };

  res.status(200).json(db);
});

// API endpoint to get a specific todo
// assumption (auth middleware) if applicable
app.get("/api/todos/:id", (req, res) => {
  const todo = db[req.params.id];

  // integration test (db)
  if (!todo) {
    return res.status(404).json({ message: "Todo not found." });
  }

  res.status(200).json(todo);
});

// API endpoint to update a specific todo
// assumption (auth middleware)
app.put("/api/todos/:id", (req, res) => {
  const { title, content } = req.body;

  // validation integration test (middleware)
  if (!title || !content) {
    return res.status(400).json({ message: "Both title and content are required." });
  };

  // database integration test
  const todo = db[req.params.id];
  if (!todo) {
    return res.status(404).json({ message: "Todo not found." });
  }

  // update todo, and save to database
  db[req.params.id] = { title, content };

  // publisher event stating that a todo was updated
  res.status(200).json({
    message: "Todo was updated",
    event: {
      topic: "todo-updated",
      todo: { id: req.params.id, ...db[req.params.id] }
    },
    todo: { id: req.params.id, ...db[req.params.id] }
  });
});

// API endpoint to delete a specific todo
// assumption auth middleware
app.delete("/api/todos/:id", (req, res) => {
  const todo = db[req.params.id];

  // db integration test
  if (!todo) {
    return res.status(404).json({ message: "Todo not found." });
  }

  // delete todo
  // integration test db that todo has been deleted
  delete db[req.params.id];

  // event todo-deleted
  res.status(200).json({
    message: "Todo was deleted.",
    event: {
      topic: "todo-deleted"
    }
  });
});

export default app;
