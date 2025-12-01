import { tipo } from "../models/tipo.js";

// POST /api/tipo/registrar
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

// GET /api/tipo/consulta
const consulta = async (req, res, next) => {
  try {
    const tipos = await tipo.find({ activo: true }).select("nombre");
    res.json(tipos);
  } catch (error) {
    console.log(error);
    next();
  }
};

// PUT /api/tipo/actualizar
const actualizar = async (req, res) => {
  const id = req.params.id;
  const { nombre } = req.body;

  const tipos = await tipo.findOneAndUpdate(
    { _id: id, activo: true },
    {
      $set: {
        nombre: nombre,
      },
    },
    { new: true }
  );

  res.json({ mensaje: "Tipo actualizado", tipos });
};

// DELETE /api/tipo/eliminar

const eliminar = async (req, res) => {
  const id = req.params.id;
  try {
    const tipoOculto = await tipo.findOneAndUpdate(
      { _id: id, activo: true },
      { $set: { activo: false } },
      { new: true }
    );

    if (!tipoOculto) {
      return res
        .status(404)
        .json({ mensaje: "Tipo no encontrado o ya estaba inactivo." });
    }

    res.json({ mensaje: "Tipo desactivado (Soft Delete) correctamente" });
  } catch (error) {
    console.error("Error al desactivar tipo:", error);
    res
      .status(500)
      .json({ mensaje: "Error al desactivar tipo", error: error.message });
  }
};

export { crear, actualizar, eliminar, consulta };
