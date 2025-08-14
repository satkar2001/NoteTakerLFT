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

// Get all notes for the logged-in user with pagination and filtering
export const getNotes = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Pagination parameters
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    // Filtering parameters
    const search = req.query.search as string;
    const tags = req.query.tags as string;
    const showFavorites = req.query.favorites === 'true';

    // Sorting parameters
    const sortBy = req.query.sortBy as string || 'createdAt';
    const sortOrder = req.query.sortOrder as string || 'desc';

    // Build where clause
    const where: any = { userId };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
        { tags: { hasSome: [search] } }
      ];
    }

    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim());
      where.tags = { hasSome: tagArray };
    }

    if (showFavorites) {
      where.isFavorite = true;
    }

    const orderBy: any = {};
    orderBy[sortBy] = sortOrder;

    const [notes, totalCount] = await Promise.all([
      prisma.note.findMany({
        where,
        orderBy,
        skip,
        take: limit,
      }),
      prisma.note.count({ where })
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    res.json({
      notes,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
};

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

    const note = await prisma.note.findFirst({
      where: { id, userId },
    });

    if (!note) {
      return res.status(404).json({ error: 'Note not found or unauthorized' });
    }

    const updatedNote = await prisma.note.update({
      where: { id },
      data: {
        title,
        content,
        tags: tags || [],
      },
    });

    res.json(updatedNote);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update note' });
  }
};

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

    const note = await prisma.note.findFirst({
      where: { id, userId },
    });

    if (!note) {
      return res.status(404).json({ error: 'Note not found or unauthorized' });
    }

    await prisma.note.delete({
      where: { id },
    });

    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete note' });
  }
};

export const convertLocalNotes = async (req: Request, res: Response) => {
  try {
    const { notes } = req.body;
    const userId = (req as any).userId;

    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!Array.isArray(notes)) {
      return res.status(400).json({ error: 'Notes array is required' });
    }

    const convertedNotes = await Promise.all(
      notes.map(note => 
        prisma.note.create({
          data: {
            title: note.title,
            content: note.content,
            tags: note.tags || [],
            userId,
          },
        })
      )
    );

    res.json({ 
      message: `${convertedNotes.length} notes converted successfully`,
      notes: convertedNotes 
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to convert notes' });
  }
};

export const toggleFavorite = async (req: Request, res: Response) => {
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

    const updatedNote = await prisma.note.update({
      where: { id },
      data: {
        isFavorite: !note.isFavorite,
      },
    });

    res.json(updatedNote);
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle favorite status' });
  }
};
