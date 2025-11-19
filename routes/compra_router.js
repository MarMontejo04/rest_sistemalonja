import express from "express";
import {
  crear,
  consulta,
  actualizar,
  eliminar,
  consultaId,
} from "../controller/compraController.js";
const router = express.Router();

router.post("/registrar", crear);
router.get("/consulta", consulta);
router.get("/consulta/:id", consultaId);
router.put("/actualizar/:id", actualizar);
router.delete("/eliminar/:id", eliminar);

export default router;
