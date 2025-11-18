import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: ".env" });
// import cors from "cors";

mongoose.Promise = global.Promise;

mongoose.connect(process.env.MONGO_URI)

const app = express();


//accesos json
app.use(express.json());

//accesos a los datos del formulario
app.use(express.urlencoded({ extended: true }));

//Seguridad
// app.use(cors());

//app.use("/api", router);

//definiendo el puerto
const port = 2801;
app.listen(port, () => {
  console.log(`Esperando peticiones en el puerto ${port}`);
});