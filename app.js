import express from 'express';
import tasks from './tasks.js';  // Importing the tasks router
import books from './books.js';
import todos from './todos.js';

const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// In-memory database for blogs
const db = {};

// Function to generate a unique ID using timestamp + random string
const generateId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

// API endpoint to create a blog
app.post("/api/blogs", (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: "Both title and content are required." });
  }

  const id = generateId();
  db[id] = { title, content };
  res.status(201).json({ message: "Blog post has been created.", blog: { id, ...db[id] } });
});

// API endpoint to get all blogs
app.get("/api/blogs", (req, res) => {
  res.status(200).json(db);
});

// API endpoint to get a specific blog post
app.get("/api/blogs/:id", (req, res) => {
  const blog = db[req.params.id];
  if (!blog) {
    res.status(404).json({ message: "Blog post was not found." });
  }
  res.status(200).json(blog);
});

// API endpoint to update a specific blog
app.put("/api/blogs/:id", (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: "Both title and content are required." });
  }

  const blog = db[req.params.id];

  if (!blog) {
    res.status(404).json({ message: "Blog was not found." });
  }

  db[req.params.id] = { title, content };

  res.status(200).json({ message: "Blog post updated.", blog: db[req.params.id] });
});

// API endpoint to delete a blog post
app.delete("/api/blogs/:id", (req, res) => {
  const blog = db[req.params.id];

  if (!blog) {
    res.status(404).json({ message: "Blog was not found." });
  }

  delete db[req.params.id];
  res.status(200).json({ message: "Blog post was deleted." });
});

// Use the tasks router
app.use(tasks);
app.use(books);
app.use(todos);

export default app;
