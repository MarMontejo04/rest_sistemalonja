import { especie } from "../models/especie.js";

const consulta = async (req, res, next) => {
  try {
    const especies = await especie.find({});
    res.json(especies);
  } catch (error) {
    console.log(error);
    next();
  }
};

const consultaId = async (req, res, next) => {
  try {
    const especies = await especie.findById(req.params.id);
    if (!especies) {
      res.json({
        mensaje: "La especie no existe",
      });
      next;
    }
    res.json(especies);
  } catch (error) {
    res.send(error);
    next();
  }
};

const actualizar = async (req, res) => {
  const id = req.params.id;
  const { nombre, id_lte, id_tpo, imagen } = req.body;

  const especies = await especie.findOneAndUpdate(
    { _id: id },
    {
      $set: {
        nombre: nombre,
        id_lte: id_lte,
        id_tpo: id_tpo,
        imagen: imagen,
      },
    },
    { new: true }
  );

  res.json({ mensaje: "Especie actualizada", especies });
};

const eliminar = async (req, res) => {
  const id = req.params.id;
  const especies = await especie.findOneAndDelete({ _id: id });

  if (especies) {
    res.json({ mensaje: "Especie borrada" });
  }
};

export { actualizar, eliminar, consulta, consultaId };
