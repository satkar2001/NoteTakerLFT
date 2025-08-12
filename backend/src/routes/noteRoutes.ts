import express from 'express';
import {
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote,
  convertLocalNotes,
} from '../controllers/noteController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { validateNote } from '../middleware/validationMiddleware.js';

const router = express.Router();

// Public route for creating local notes (no auth required)
router.post('/local', validateNote, createNote);

// Protected routes (require authentication)
router.post('/', authenticate, validateNote, createNote);
router.get('/', authenticate, getNotes);
router.get('/:id', authenticate, getNoteById);
router.put('/:id', authenticate, validateNote, updateNote);
router.delete('/:id', authenticate, deleteNote);
router.post('/convert-local', authenticate, convertLocalNotes);

export default router;
