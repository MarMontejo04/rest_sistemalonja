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
    const compradores = await comprador.find({});
    res.json(compradores);
  } catch (error) {
    console.log(error);
    res.status(500).json({ mensaje: "Error al consultar compradores" });
  }
};


// GET /api/comprador/:id
const consultaId = async (req, res) => {
  try {
    const compradores = await comprador.findById(req.params.id);

    if (!compradores) {
      return res.status(404).json({ mensaje: "El comprador no existe" });
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
      req.params.id,
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
  try {
    const compradores = await comprador.findByIdAndDelete(req.params.id);

    if (!compradores) {
      return res.status(404).json({ mensaje: "El comprador no existe" });
    }

    res.json({ mensaje: "Comprador borrado" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ mensaje: "Error al eliminar comprador" });
  }
};


export { crear, actualizar, eliminar, consulta, consultaId };
