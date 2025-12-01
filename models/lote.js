import mongoose, { model } from "mongoose";
const Schema = mongoose.Schema;

mongoose.pluralize(null);
const loteSchema = new Schema({
  kilos: {
    type: Number,
    required: true,
  },
  numero_cajas: {
    type: Number,
    required: true,
  },
  precio_kilo_salida: {
    type: Number,
    required: true,
  },
  fecha: {
    type: Date,
    required: true,
  },
  id_cmp: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'compra',
    required: false,
    default: null,
  },
  activo: {
    type: Boolean,
    default: true
  }
});

const lote = mongoose.model("lote", loteSchema);

export { lote };
