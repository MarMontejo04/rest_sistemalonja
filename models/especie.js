import mongoose, { model } from "mongoose";
const Schema = mongoose.Schema;

mongoose.pluralize(null);
const especieSchema = new Schema({
  id_epe: {
    type: Number,
    required: true,
    unique: true,
  },
  nombre: {
    type: String,
    required: true,
    maxlength: 25,
  },
  id_tpo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "tipo",
    required: true,
  },
  id_lte: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "lote",
    required: true,
  },
  imagen: {
    type: String,
    maxlength: 100,
  },
});

const especie = mongoose.model("especie", especieSchema);

export { especie };
