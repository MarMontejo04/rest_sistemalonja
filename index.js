import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: ".env" });
import cors from "cors";

import auth_router from "./routes/auth_router.js";
import tipo_router from "./routes/tipo_router.js";
import compra_router from "./routes/compra_router.js"
import comprador_router from "./routes/comprador_router.js"
import especie_router from "./routes/especie_router.js"
import lote_router from "./routes/lote_router.js"
import loteespecie_router from "./routes/loteespecie_router.js"
import reporte_router from "./routes/reporte_router.js"


mongoose.Promise = global.Promise;

mongoose.connect(process.env.MONGO_URI);

const app = express();

//accesos json
app.use(express.json());

//accesos a los datos del formulario
app.use(express.urlencoded({ extended: true }));

app.use(cors());

//Inicio
//app.use("/api", router);
app.use("/api/auth", auth_router);
app.use("/api/compra", compra_router);
app.use("/api/comprador", comprador_router);
app.use("/api/especie", especie_router);
app.use("/api/lote", lote_router);
app.use("/api/tipo", tipo_router);
app.use("/api/lote-especie", loteespecie_router)
app.use("/api/reporte", reporte_router)

//definiendo el puerto
const port = 3001;
app.listen(port, () => {
  console.log(`Esperando peticiones en el puerto ${port}`);
});
