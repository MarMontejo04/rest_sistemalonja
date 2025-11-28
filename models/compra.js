import mongoose, { model } from "mongoose";
const Schema = mongoose.Schema;

mongoose.pluralize(null);
const compraSchema = new Schema({
  codigo_cpr: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "comprador",
    required: true,
  },
  precio_kilo_final: {
    type: Number,
    required: true,
  },
  precio_total: {
    type: Number,
    required: true,
  },
  fecha: {
    type: Date,
    default: Date.now,
  },
});

const compra = mongoose.model("compra", compraSchema);

export { compra };
