import { Router } from 'express';
import { Reloop } from '../../../reloop-node/src/index'; // Relative import to local SDK

const router = Router();

// Initialize Reloop client
const getReloopClient = () => {
    const apiKey = process.env.RELOOP_API_KEY;
    if (!apiKey) {
        throw new Error('RELOOP_API_KEY environment variable is not set');
    }
    return new Reloop({ apiKey });
};

// GET /api/api-keys - List keys
router.get('/', async (req, res) => {
    try {
        const reloop = getReloopClient();
        const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
        const page = req.query.page ? parseInt(req.query.page as string) : 1;
        
        const response = await reloop.apiKeys.list({ limit, page });
        res.json(response);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/api-keys - Create a key
router.post('/', async (req, res) => {
    try {
        const reloop = getReloopClient();
        const { name } = req.body;
        
        if (!name) {
            return res.status(400).json({ error: 'Name is required' });
        }
        
        const response = await reloop.apiKeys.create({ name });
        res.status(201).json(response);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/api-keys/:id - Get a key
router.get('/:id', async (req, res) => {
    try {
        const reloop = getReloopClient();
        const response = await reloop.apiKeys.get(req.params.id);
        res.json(response);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE /api/api-keys/:id - Delete a key
router.delete('/:id', async (req, res) => {
    try {
        const reloop = getReloopClient();
        const response = await reloop.apiKeys.delete(req.params.id);
        res.json(response);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
