import { Router } from 'express';
import { Reloop } from 'reloop-email'

const router = Router();

const getReloopClient = () => {
    const apiKey = process.env.RELOOP_API_KEY;
    if (!apiKey) {
        throw new Error('RELOOP_API_KEY environment variable is not set');
    }
    return new Reloop({ apiKey });
};

// ----------------------------------------------------
// 1. POST /api/api-keys - Create a new API Key
// ----------------------------------------------------
router.post('/', async (req, res) => {
    try {
        const reloop = getReloopClient();
        const { name } = req.body;
        // Input Validation
        if (!name) {
            return res.status(400).json({ success: false, error: 'Name is required' });
        }
        // Call the Reloop SDK
        const result = await reloop.apiKey.create({ name });
        // Handle SDK Error
        if (result.error) {
            return res.status(400).json({ success: false, error: result.error });
        }
        // Return 201 Created with the new API key data
        return res.status(201).json({ success: true, data: result.response });
    } catch (error: any) {
        return res.status(500).json({ success: false, error: error.message });
    }
});

// ----------------------------------------------------
// 2. GET /api/api-keys - List API Keys with Pagination
// ----------------------------------------------------
router.get('/', async (req, res) => {
    try {
        const reloop = getReloopClient();
        
        // Parse query parameters (limit and page)
        const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
        const page = req.query.page ? parseInt(req.query.page as string) : 1;

        // Call the Reloop SDK
        const response = await reloop.apiKey.list({ limit, page });

        // Handle SDK Error
        if (response.error) {
            return res.status(400).json({ success: false, error: response.error });
        }

        // Return 200 OK with the array of keys
        return res.json({ success: true, data: response.response });
    } catch (error: any) {
        return res.status(500).json({ success: false, error: error.message });
    }
});

// ----------------------------------------------------
// 3. GET /api/api-keys/:id - Retrieve API Key Details by ID
// ----------------------------------------------------
router.get('/:id', async (req, res) => {
    try {
        const reloop = getReloopClient();
        const keyId = req.params.id;

        // Call the Reloop SDK
        const response = await reloop.apiKey.get(keyId);

        // Handle SDK Error (e.g. 404 Key Not Found)
        if (response.error) {
            return res.status(404).json({ success: false, error: response.error });
        }

        // Return 200 OK with the single key's metadata
        return res.json({ success: true, data: response.response });
    } catch (error: any) {
        return res.status(500).json({ success: false, error: error.message });
    }
});

// ----------------------------------------------------
// 4. PATCH /api/api-keys/:id - Update / Rename API Key
// ----------------------------------------------------
router.patch('/:id', async (req, res) => {
    try {
        const reloop = getReloopClient();
        const { name } = req.body;

        // Input Validation
        if (!name) {
            return res.status(400).json({ success: false, error: 'Name is required' });
        }

        // Call the Reloop SDK to rename the key
        const response = await reloop.apiKey.update(req.params.id, { name });

        // Handle SDK Error
        if (response.error) {
            return res.status(response.error.status || 400).json({
                success: false,
                error: response.error.body
            });
        }

        // Return 200 OK with the updated key metadata
        return res.json({ success: true, data: response.response });
    } catch (error: any) {
        return res.status(500).json({ success: false, error: error.message });
    }
});

// ----------------------------------------------------
// 5. POST /api/api-keys/:id/disable - Disable an API Key
// ----------------------------------------------------
router.post('/:id/disable', async (req, res) => {
    try {
        const reloop = getReloopClient();

        // Call the Reloop SDK to disable the key
        const response = await reloop.apiKey.disable(req.params.id);

        // Handle SDK Error
        if (response.error) {
            return res.status(response.error.status || 400).json({
                success: false,
                error: response.error.body
            });
        }

        // Return 200 OK with enabled: false
        return res.json({ success: true, data: response.response });
    } catch (error: any) {
        return res.status(500).json({ success: false, error: error.message });
    }
});

// ----------------------------------------------------
// 6. POST /api/api-keys/:id/enable - Enable an API Key
// ----------------------------------------------------
router.post('/:id/enable', async (req, res) => {
    try {
        const reloop = getReloopClient();

        // Call the Reloop SDK to enable the key
        const response = await reloop.apiKey.enable(req.params.id);

        // Handle SDK Error
        if (response.error) {
            return res.status(response.error.status || 400).json({
                success: false,
                error: response.error.body
            });
        }

        // Return 200 OK with enabled: true
        return res.json({ success: true, data: response.response });
    } catch (error: any) {
        return res.status(500).json({ success: false, error: error.message });
    }
});

// ----------------------------------------------------
// 7. POST /api/api-keys/:id/rotate - Rotate API Key Secret
// ----------------------------------------------------
router.post('/:id/rotate', async (req, res) => {
    try {
        const reloop = getReloopClient();

        // Call the Reloop SDK to rotate the key
        const response = await reloop.apiKey.rotate(req.params.id);

        // Handle SDK Error
        if (response.error) {
            return res.status(response.error.status || 400).json({
                success: false,
                error: response.error.body
            });
        }

        // Return 200 OK with the new plaintext key secret
        return res.json({ success: true, data: response.response });
    } catch (error: any) {
        return res.status(500).json({ success: false, error: error.message });
    }
});

// ----------------------------------------------------
// 8. DELETE /api/api-keys/:id - Delete an API Key
// ----------------------------------------------------
router.delete('/:id', async (req, res) => {
    try {
        const reloop = getReloopClient();

        // Call the Reloop SDK to delete the key
        const response = await reloop.apiKey.delete(req.params.id);

        // Handle SDK Error
        if (response.error) {
            return res.status(response.error.status || 400).json({
                success: false,
                error: response.error.body
            });
        }

        // Return 200 OK confirming deletion
        return res.json({ success: true, data: response.response });
    } catch (error: any) {
        return res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
