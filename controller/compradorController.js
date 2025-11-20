import { comprador } from "../models/comprador.js";

const crear = async (req, res, next) => {
  const datos = req.body;
  console.log(datos);
  const compradores = new comprador(datos);
  try {
    await compradores.save();
    res.json({
      mensaje: "Se creo el comprador",
    });
  } catch (error) {
    console.log(error);
    next();
  }
};

const consulta = async (req, res, next) => {
  try {
    const compradores = await comprador.find({});
    res.json(compradores);
  } catch (error) {
    console.log(error);
    next();
  }
};

const consultaId = async (req, res, next) => {
  try {
    const compradores = await comprador.findById(req.params.id);
    if (!compradores) {
      res.json({
        mensaje: "El comprador no existe",
      });
      next;
    }
    res.json(compradores);
  } catch (error) {
    res.send(error);
    next();
  }
};

const actualizar = async (req, res) => {
  const id = req.params.id;
  const { nombre, apellido_paterno, apellido_materno, direccion, correo } =
    req.body;

  const compradores = await comprador.findOneAndUpdate(
    { _id: id },
    {
      $set: {
        nombre: nombre,
        apellido_paterno: apellido_paterno,
        apellido_materno: apellido_materno,
        direccion: direccion,
        correo: correo,
      },
    },
    { new: true }
  );

  res.json({ mensaje: "Comprador actualizado", compradores });
};

const eliminar = async (req, res) => {
  const id = req.params.id;
  const compradores = await comprador.findOneAndDelete({ _id: id });

  if (compradores) {
    res.json({ mensaje: "Comprador borrado" });
  }
};

export { crear, actualizar, eliminar, consulta, consultaId };
