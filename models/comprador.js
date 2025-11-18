import mongoose, { model } from "mongoose";
const Schema = mongoose.Schema;

mongoose.pluralize(null);
const compradorSchema = new Schema({
  codigo_cpr: {
    type: Number,
    required: true,
    unique: true,
  },
  nombre: {
    type: String,
    required: true,
    maxlength: 15,
    trim: true,
  },
  apellido_paterno: {
    type: String,
    required: true,
    maxlength: 15,
    trim: true,
  },
  apellido_materno: {
    type: String,
    maxlength: 15,
    trim: true,
  },
  direccion: {
    type: String,
    maxlength: 200,
    trim: true,
  },
  correo: {
    type: String,
    required: true,
    unique: true,
    maxlength: 80,
    trim: true,
  },
});

const comprador = mongoose.model("comprador", compradorSchema);

export { comprador };
