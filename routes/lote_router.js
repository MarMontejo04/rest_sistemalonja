import express from "express";
import {
  consulta,
  actualizar,
  eliminar,
} from "../controller/loteController.js";
const router = express.Router();

router.get("/consulta", consulta);
router.put("/actualizar/:id", actualizar);
router.delete("/eliminar/:id", eliminar);

export default router;
