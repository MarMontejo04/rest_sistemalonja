import express from 'express';
import { crear, consultaTipo, actualizar } from '../controller/loteEspecieController.js';

const router = express.Router();

router.post('/registrar', crear);
router.get('/consulta-tpo/:nombre', consultaTipo);
router.put('/actualizar/:id', actualizar  )


export default router;