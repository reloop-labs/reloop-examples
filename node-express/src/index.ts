import express from 'express';
import dotenv from 'dotenv';
import apiKeyRoutes from './routes/apiKeys';
import { mailRouter } from './routes/mail';

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());

// Mount routers
app.use('/api/api-keys', apiKeyRoutes);
app.use('/api/mail', mailRouter);

app.get('/', (req, res) => {
  res.send('Reloop Express Example API is running!');
});

app.listen(port, () => {
  console.log(`🚀 Alex's Node.js Express Server running on http://localhost:${port}`);
});
