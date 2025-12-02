import express from "express";
import { generarReporteDiario } from "../controller/reporteController.js";

const router = express.Router();

router.get('/ventas', generarReporteDiario);

export default router;