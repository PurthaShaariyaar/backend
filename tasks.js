import express from 'express';
import { body, param, validationResult } from 'express-validator';

const router = express.Router();

const db = {};

const generateId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

// API endpoint to create a task
router.post("/api/tasks",
  [
    body("title").notEmpty().withMessage("Title is required."),
    body("description").notEmpty().withMessage("Description is required.")
  ], (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description } = req.body;

    const id = generateId();

    db[id] = { title, description };

    res.status(201).json({ message: "Task was created.", task: { id, ...db[id] } });
  }
);

// API endpoint to get all tasks
router.get("/api/tasks", (req, res) => {
  if (Object.keys(db).length === 0) {
    return res.status(404).json({ message: "No tasks found" });
  }

  res.status(200).json(db);
});

// API endpoint to get a specific task with id
router.get("/api/tasks/:id",
  [
    param("id").isAlphanumeric().withMessage("ID must be alphanumeric"),
  ], (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const task = db[req.params.id];

    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }

    res.status(200).json(task);
  }
);

// API endpoint to update a specific task with id
router.put("/api/tasks/:id",
  [
    body("title").notEmpty().withMessage("Title is required."),
    body("description").notEmpty().withMessage("Description is required."),
    param("id").isAlphanumeric().withMessage("ID must be alphanumeric")
  ], (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description } = req.body;

    const task = db[req.params.id];

    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    };

    db[req.params.id] = { title, description };

    res.status(200).json({ message: "Task was updated.", task: db[req.params.id] });
  }
)

// API endpoint to delete a specific task with id
router.delete("/api/tasks/:id",
  [
    param("id").isAlphanumeric().withMessage("ID must be alphanumeric")
  ], (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const task = db[req.params.id];

    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }

    delete db[req.params.id];

    res.status(200).json({ message: "Task was deleted." });
  }
)

export default router;
