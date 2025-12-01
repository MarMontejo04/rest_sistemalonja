import express from "express";
import {
  crear,
  consulta,
  actualizar,
  eliminar,
  consultaId,
  autenticarUsuario,
} from "../controller/authController.js";
const router = express.Router();

router.post("/registrar", crear);
router.get("/login", autenticarUsuario);
router.get("/consulta", consulta);
router.get("/consulta/:id", consultaId);
router.put("/actualizar/:id", actualizar);
router.delete("/eliminar/:id", eliminar);

export default router;
