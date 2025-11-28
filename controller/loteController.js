import { lote } from "../models/lote.js";
import { compra } from "../models/compra.js";
import { especie } from "../models/especie.js";

const crear = async (req, res, next) => {
  const { kilos, numero_cajas, precio_kilo_salida, fecha, id_epe } = req.body;
  try {
    const especieVerificar = await especie.findById(id_epe).select("id_lte");

    if (!especieVerificar) {
      return res.json({
        mensaje: "El ID de la Especie proporcionado no existe.",
      });
    }

    const nuevoLote = new lote({
      kilos,
      numero_cajas,
      precio_kilo_salida,
      fecha,
      id_cmp: null,
    });

    await nuevoLote.save();

    res.json({
      mensaje: "Se creo el lote",
      nuevoLote,
    });

    const especieVinculada = await especie.findByIdAndUpdate(
      id_epe_asociada,
      { $set: { id_lte: nuevoLote._id} },
      { new: true }
    );

    if (!especieVinculada) {
      return res.json({
        mensaje: "Especie seleccionada no encontrada o no válida.",
      });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ mensaje: "Error al crear el lote", error: error.message });
    next(error);
  }
};

const consulta = async (req, res, next) => {
  try {
    const lotes = await lote.find({});
    res.json(lotes);
  } catch (error) {
    console.log(error);
    next();
  }
};

const consultaId = async (req, res, next) => {
  try {
    const lotes = await lote.findById(req.params.id);
    if (!lotes) {
      res.json({
        mensaje: "El lote no existe",
      });
      next;
    }
    res.json(lotes);
  } catch (error) {
    res.send(error);
    next();
  }
};

const actualizar = async (req, res) => {
  const id = req.params.id;
  const { kilos, numero_cajas, precio_kilo_salida, fecha, id_cmp } = req.body;

  const lotes = await lote.findOneAndUpdate(
    { _id: id },
    {
      $set: {
        kilos: kilos,
        numero_cajas: numero_cajas,
        precio_kilo_salida: precio_kilo_salida,
        fecha: fecha,
        id_cmp: id_cmp,
      },
    },
    { new: true }
  );

  res.json({ mensaje: "Lote actualizado", lotes });
};

const eliminar = async (req, res) => {
  const id = req.params.id;
  const lotes = await lote.findOneAndDelete({ _id: id });

  if (lotes) {
    res.json({ mensaje: "Lote borrado" });
  }
};

export { crear, actualizar, eliminar, consulta, consultaId };
