import express from "express";
import {
  consulta,
  actualizar,
  eliminar,
  consultaId,
} from "../controller/especieController.js";
const router = express.Router();

router.get("/consulta", consulta);
router.get("/consulta/:id", consultaId);
router.put("/actualizar/:id", actualizar);
router.delete("/eliminar/:id", eliminar);

export default router;
