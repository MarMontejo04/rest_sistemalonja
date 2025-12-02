import express from "express";
import {
  crear,
  consulta,
  actualizar,
  eliminar,
  autenticarUsuario,
} from "../controller/authController.js";
const router = express.Router();

router.post("/registrar", crear);
router.post("/login", autenticarUsuario);
router.get("/consulta", consulta);
router.put("/actualizar/:id", actualizar);
router.delete("/eliminar/:id", eliminar);

export default router;
