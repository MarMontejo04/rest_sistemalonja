import mongoose, { model } from "mongoose";
const Schema = mongoose.Schema;

mongoose.pluralize(null);
const especieSchema = new Schema({
  nombre: {
    type: String,
    required: true,
    maxlength: 25,
  },
  id_tpo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "tipo",
  },
  id_lte: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "lote",
  },
  imagen: {
    type: String,
    maxlength: 100,
  },
  activo: {
    type: Boolean,
    default: true
  }
});

const especie = mongoose.model("especie", especieSchema);

export { especie };
