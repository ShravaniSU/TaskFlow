import { Router } from 'express';
import todoRoutes from './todo.routes.js';

const router = Router();

router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

router.use('/todos', todoRoutes);

export default router;
