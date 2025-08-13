import prisma from '../lib/prismaClient.js';
// Create a new note (can be used by both authenticated and unauthenticated users)
export const createNote = async (req, res) => {
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
        const userId = req.userId;
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
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create note' });
    }
};
// Get all notes for the logged-in user with pagination and filtering
export const getNotes = async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ error: 'Authentication required' });
        }
        // Pagination parameters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;
        // Filtering parameters
        const search = req.query.search;
        const tags = req.query.tags;
        const showFavorites = req.query.favorites === 'true';
        // Sorting parameters
        const sortBy = req.query.sortBy || 'createdAt';
        const sortOrder = req.query.sortOrder || 'desc';
        // Build where clause
        const where = { userId };
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
            where.tags = { has: 'favorite' };
        }
        // Build orderBy clause
        const orderBy = {};
        orderBy[sortBy] = sortOrder;
        // Get notes with pagination
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
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch notes' });
    }
};
// Get a single note by ID
export const getNoteById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;
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
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch note' });
    }
};
// Update a note
export const updateNote = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, tags } = req.body;
        const userId = req.userId;
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
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update note' });
    }
};
// Delete a note
export const deleteNote = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;
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
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete note' });
    }
};
// Convert local notes to permanent notes
export const convertLocalNotes = async (req, res) => {
    try {
        const { notes } = req.body;
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ error: 'Authentication required' });
        }
        if (!Array.isArray(notes)) {
            return res.status(400).json({ error: 'Notes array is required' });
        }
        const convertedNotes = await Promise.all(notes.map(note => prisma.note.create({
            data: {
                title: note.title,
                content: note.content,
                tags: note.tags || [],
                userId,
            },
        })));
        res.json({
            message: `${convertedNotes.length} notes converted successfully`,
            notes: convertedNotes
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to convert notes' });
    }
};
//# sourceMappingURL=noteController.js.map