import mongoose, { model } from "mongoose";
const Schema = mongoose.Schema;

mongoose.pluralize(null);
const usuarioSchema = new Schema({
  nombre: {
    type: String,
    required: true,
  },
  ap_paterno: {
    type: String,
    required: true,
  },
  ap_materno: {
    type: String,
    required: true,
  },
  correo: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const usuario = mongoose.model("usuario", usuarioSchema);

export { usuario };
