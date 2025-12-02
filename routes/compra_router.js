import express from "express";
import {
  crear,
  consulta,
  actualizar,
  eliminar,
  consultaCorreo,
} from "../controller/compradorController.js";

const router = express.Router();

router.post("/registrar", crear);
router.get("/consulta", consulta);
router.get("/correo/:correo", consultaCorreo);
router.put("/actualizar/:id", actualizar);
router.delete("/eliminar/:id", eliminar);

export default router;
