import express from 'express';
import { body, param, validationResult } from 'express-validator';

const router = express.Router();

const db = {};

const generateId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

router.post("/api/books",
  [
    body("title").notEmpty().withMessage("Title is required."),
    body("description").notEmpty().withMessage("Description is required.")
  ], (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    }

    const { title, description } = req.body;

    const id = generateId();

    db[id] = { title, description };

    res.status(201).json({
      message: "Book was created.",
      event: {
        topic: "book-created",
        book: {
          id, ...db[id]
        }
      },
      book: {
        id, ...db[id]
      }
    });
  }
)

router.get("/api/books", (req, res) => {
  if (Object.keys(db).length === 0) {
    return res.status(404).json({ message: "No books found." });
  }

  res.status(200).json(db);
});

router.get("/api/books/:id",
  [
    param("id").isAlphanumeric().withMessage("ID must be alphanumeric.")
  ], (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    }

    const book = db[req.params.id];

    if (!book) {
      res.status(404).json({ message: "Book not found." });
    }

    res.status(200).json(book);
  }
)

export default router;
