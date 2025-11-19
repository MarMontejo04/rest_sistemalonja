import { tipo } from "../models/tipo.js";

const crear = async (req, res, next) => {
  const datos = req.body;
  console.log(datos);
  const tipos = new tipo(datos);
  try {
    await tipos.save();
    res.json({
      mensaje: "Se creo el tipo",
    });
  } catch (error) {
    console.log(error);
    next();
  }
};

const consulta = async (req, res, next) => {
  try {
    const tipos = await tipo.find({});
    res.json(tipos);
  } catch (error) {
    console.log(error);
    next();
  }
};

const consultaId = async (req, res, next) => {
  try {
    const tipos = await tipo.findById(req.params.id);
    if (!tipos) {
      res.json({
        mensaje: "El tipo no existe",
      });
      next;
    }
    res.json(tipos);
  } catch (error) {
    res.send(error);
    next();
  }
};

const actualizar = async (req, res) => {
  const id = req.params.id;
  const { nombre} = req.body;

  const tipos = await tipo.findOneAndUpdate(
    { _id: id },
    {
      $set: {
        nombre: nombre,
      },
    },
    { new: true }
  );

  res.json({ mensaje: "Tipo actualizado", tipos });
};

const eliminar = async (req, res) => {
  const id = req.params.id;
  const tipos = await tipo.findOneAndDelete({ _id: id });

  if (tipos) {
    res.json({ mensaje: "Tipo borrado" });
  }
};

export { crear, actualizar, eliminar, consulta, consultaId };
