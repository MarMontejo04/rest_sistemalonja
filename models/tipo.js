import mongoose, { model } from "mongoose";
const Schema = mongoose.Schema;

mongoose.pluralize(null);
const tipoSchema = new Schema({
  nombre: {
    type: String,
    required: true,
    maxlength: 30,
  },
  activo: {
    type: Boolean,
    default: true
  }
});


const tipo = mongoose.model("tipo", tipoSchema);

export { tipo };
