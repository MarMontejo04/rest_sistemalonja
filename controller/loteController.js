import { lote } from "../models/lote.js";

const crear = async (req, res, next) => {
  const datos = req.body;
  console.log(datos);
  const lotes = new lote(datos);
  try {
    await lotes.save();
    res.json({
      mensaje: "Se creo el lote",
    });
  } catch (error) {
    console.log(error);
    next();
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
  const { kilos, numero_cajas, precio_kilo_salida, fecha } = req.body;

  const lotes = await lote.findOneAndUpdate(
    { _id: id },
    {
      $set: {
        kilos: kilos,
        numero_cajas: numero_cajas,
        precio_kilo_salida: precio_kilo_salida,
        fecha: fecha,
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
