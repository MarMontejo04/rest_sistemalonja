import express from 'express';
import { crear, consultaTipo } from '../controller/loteEspecieController.js';

const router = express.Router();

router.post('/registrar', crear);
router.get('/consulta-tpo/:nombre', consultaTipo);


export default router;