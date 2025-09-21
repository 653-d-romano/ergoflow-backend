import { Router } from 'express';
import { q } from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

router.post('/', async (req, res) => {
  const { name, note } = req.body;
  const { rows } = await q(
    'INSERT INTO clients (user_id, name, note) VALUES ($1, $2, $3) RETURNING id, name, note, created_at',
    [req.user.id, name, note || null]
  );
  res.json(rows[0]);
});

router.get('/', async (req, res) => {
  const { rows } = await q('SELECT id, name, note, created_at FROM clients WHERE user_id=$1 ORDER BY created_at DESC', [req.user.id]);
  res.json(rows);
});

export default router;