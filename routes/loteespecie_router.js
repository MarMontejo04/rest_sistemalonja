import express from 'express';
import { crear, consultaTipo, actualizar, eliminar, consultaId } from '../controller/loteEspecieController.js';

const router = express.Router();

router.post('/registrar', crear);
router.get('/consulta-tpo/:nombre', consultaTipo);
router.put('/actualizar/:id', actualizar  )
router.delete('/eliminar/:id', eliminar  )
router.get('/consulta/:id', consultaId);


export default router;