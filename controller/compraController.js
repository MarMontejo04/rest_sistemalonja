import { compra } from "../models/compra.js";

const crear = async (req, res, next) => {
  const datos = req.body;
  console.log(datos);
  const compras = new compra(datos);
  try {
    await compras.save();
    res.json({
      mensaje: "Se creo la compra",
    });
  } catch (error) {
    console.log(error);
    next();
  }
};

const consulta = async (req, res, next) => {
  try {
    const compras = await compra.find({});
    res.json(compras);
  } catch (error) {
    console.log(error);
    next();
  }
};

const consultaId = async (req, res, next) => {
  try {
    const compras = await compra.findById(req.params.id);
    if (!compras) {
      res.json({
        mensaje: "La compra no existe",
      });
      next;
    }
    res.json(compras);
  } catch (error) {
    res.send(error);
    next();
  }
};

const actualizar = async (req, res) => {
  const id = req.params.id;
  const { codigo_cpr, id_lte, precio_kilo_final, precio_total, fecha} = req.body;

  const compras = await compra.findOneAndUpdate(
    { _id: id },
    {
      $set: {
        codigo_cpr: codigo_cpr,
        precio_kilo_final: precio_kilo_final,
        precio_total: precio_total,
        fecha: fecha,
      },
    },
    { new: true }
  );

  res.json({ mensaje: "Compra actualizado", compras });
};

const eliminar = async (req, res) => {
  const id = req.params.id;
  const compras = await compra.findOneAndDelete({ _id: id });

  if (compras) {
    res.json({ mensaje: "Compra borrado" });
  }
};

export { crear, actualizar, eliminar, consulta, consultaId };
