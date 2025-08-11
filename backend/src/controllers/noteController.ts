import { Request, Response } from 'express';
import prisma from '../lib/prismaClient.js';

// Create a new note (can be used by both authenticated and unauthenticated users)
export const createNote = async (req: Request, res: Response) => {
  try {
    const { title, content, tags, isLocal } = req.body;
    
    // If it's a local note (before signup), just return success
    if (isLocal) {
      return res.status(201).json({ 
        id: `local_${Date.now()}`,
        title,
        content,
        tags: tags || [],
        isLocal: true,
        message: 'Note saved locally. Sign up to save permanently!'
      });
    }

    // For authenticated users, save to database
    const userId = (req as any).userId;
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const note = await prisma.note.create({
      data: {
        title,
        content,
        tags: tags || [],
        userId,
      },
    });

    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create note' });
  }
};

// Get all notes for the logged-in user
export const getNotes = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const notes = await prisma.note.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
};

// Get a single note by ID
export const getNoteById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).userId;
    
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!id) {
      return res.status(400).json({ error: 'Note ID is required' });
    }

    const note = await prisma.note.findFirst({
      where: { id, userId },
    });

    if (!note) {
      return res.status(404).json({ error: 'Note not found or unauthorized' });
    }

    res.json(note);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch note' });
  }
};

// Update a note
export const updateNote = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, content, tags } = req.body;
    const userId = (req as any).userId;
    
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!id) {
      return res.status(400).json({ error: 'Note ID is required' });
    }

    const updatedNote = await prisma.note.update({
      where: { id, userId },
      data: { 
        title, 
        content, 
        tags: tags || [],
        updatedAt: new Date()
      },
    });

    res.json(updatedNote);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update note' });
  }
};

// Delete a note
export const deleteNote = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).userId;
    
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!id) {
      return res.status(400).json({ error: 'Note ID is required' });
    }

    const note = await prisma.note.deleteMany({
      where: { id, userId },
    });

    if (note.count === 0) {
      return res.status(404).json({ error: 'Note not found or unauthorized' });
    }

    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete note' });
  }
};

// Convert local notes to permanent notes after signup
export const convertLocalNotes = async (req: Request, res: Response) => {
  try {
    const { localNotes } = req.body;
    const userId = (req as any).userId;
    
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const convertedNotes = [];
    
    for (const localNote of localNotes) {
      const note = await prisma.note.create({
        data: {
          title: localNote.title,
          content: localNote.content,
          tags: localNote.tags || [],
          userId,
        },
      });
      convertedNotes.push(note);
    }

    res.json({ 
      message: 'Local notes converted successfully',
      notes: convertedNotes 
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to convert local notes' });
  }
};
