import express from 'express';

const router = express.Router();

// Ruta de prueba
router.get('/', (req, res) => {
  res.json({ message: 'Evidences route is working!' });
});

export default router;