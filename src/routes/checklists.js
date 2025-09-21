import { Router } from 'express';
import { q } from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

router.post('/instances', async (req, res) => {
  const { project_id, template_key } = req.body;
  const { rows } = await q(
    'INSERT INTO checklist_instances (user_id, project_id, template_key) VALUES ($1, $2, $3) RETURNING id, project_id, template_key, created_at',
    [req.user.id, project_id, template_key]
  );
  res.json(rows[0]);
});

router.post('/answers', async (req, res) => {
  const { checklist_instance_id, answers } = req.body;

  if (!answers || !Array.isArray(answers) || answers.length === 0) {
    return res.json({ inserted: 0 });
  }

  const values = [];
  const params = [];
  let i = 1;

  for (const a of answers) {
    params.push(checklist_instance_id, a.item_key, a.value, a.comment || null);
    values.push(`($${i++}, $${i++}, $${i++}, $${i++})`);
  }

  const sql = `
    INSERT INTO checklist_answers (checklist_instance_id, item_key, value, comment)
    VALUES ${values.join(',')}
  `;

  try {
    const result = await q(sql, params);
    res.json({ inserted: result.rowCount });
  } catch (error) {
    console.error('Error inserting answers:', error);
    res.status(500).json({ error: 'Error al guardar las respuestas' });
  }
});

export default router;