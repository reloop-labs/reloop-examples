import express from 'express';
import dotenv from 'dotenv';
import apiKeyRoutes from './routes/apiKeys';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Mount the API Keys router at /api/api-keys
app.use('/api/api-keys', apiKeyRoutes);

app.get('/', (req, res) => {
  res.send('Reloop Express Example API is running!');
});

app.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
});
