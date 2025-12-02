import { comprador } from "../models/comprador.js";

// POST /api/comprador/registrar
const crear = async (req, res) => {
  const datos = req.body;
  const compradores = new comprador(datos);

  try {
    await compradores.save();

    res.json({
      mensaje: "Se creó el comprador",
      data: compradores,
    });

  } catch (error) {

    if (error.code === 11000) {
      return res.status(400).json({
        mensaje: "El correo ya está registrado."
      });
    }

    console.log("Error al crear comprador:", error);
    return res.status(500).json({
      mensaje: "Error al crear el comprador",
      error: error.message,
    });
  }
};


// GET /api/comprador
const consulta = async (req, res) => {
  try {
    const compradores = await comprador.find({activo: true});
    res.json(compradores);
  } catch (error) {
    console.log(error);
    res.status(500).json({ mensaje: "Error al consultar compradores" });
  }
};


// GET /api/comprador/:id
const consultaCorreo = async (req, res) => {
  try {
    const compradores = await comprador.find({
  correo: req.params.correo,
  activo: true
});

if (!compradores || compradores.length === 0) {
  return res.json([]);  
}

    res.json(compradores);

  } catch (error) {
    console.log(error);
    res.status(500).json({ mensaje: "Error al buscar comprador" });
  }
};


// PUT /api/comprador/:id
const actualizar = async (req, res) => {
  try {
    const compradores = await comprador.findByIdAndUpdate(
      {_id: req.params.id, activo: true},
      req.body,
      { new: true}
    );

    if (!compradores) {
      return res.status(404).json({ mensaje: "El comprador no existe" });
    }

    res.json({ mensaje: "Comprador actualizado", compradores });

  } catch (error) {

    if (error.code === 11000) {
      return res.status(400).json({
        mensaje: "El correo ya está registrado."
      });
    }

    console.log("Error al actualizar comprador:", error);
    res.status(500).json({ mensaje: "Error al actualizar comprador" });
  }
};


// DELETE /api/comprador/:id
const eliminar = async (req, res) => {
  const id = req.params.id;
  try {
    const compradores = await comprador.findOneAndUpdate(
      { _id: id, activo: true },
      { $set: { activo: false } },
      { new: true }
    );

    if (!compradores) {
      return res.status(404).json({ mensaje: "El comprador no existe o ya estaba inactivo." });
    }

    res.json({ mensaje: "Comprador desactivado (Soft Delete) correctamente" });

  } catch (error) {
    console.error("Error al desactivar comprador:", error);
    res.status(500).json({ mensaje: "Error al desactivar comprador" });
  }
};


export { crear, actualizar, eliminar, consulta, consultaCorreo };
