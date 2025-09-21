import { Router } from 'express';
import { q } from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

router.post('/', async (req, res) => {
  const { client_id, name, area } = req.body;
  const { rows } = await q(
    'INSERT INTO projects (user_id, client_id, name, area) VALUES ($1, $2, $3, $4) RETURNING id, client_id, name, area, created_at',
    [req.user.id, client_id, name, area || null]
  );
  res.json(rows[0]);
});

router.get('/by-client/:clientId', async (req, res) => {
  const { rows } = await q(
    'SELECT id, client_id, name, area, created_at FROM projects WHERE user_id=$1 AND client_id=$2 ORDER BY created_at DESC',
    [req.user.id, req.params.clientId]
  );
  res.json(rows);
});

export default router;