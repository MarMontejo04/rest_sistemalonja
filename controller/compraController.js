import { compra } from "../models/compra.js";
import { lote } from "../models/lote.js"; //Necesario para actualizar FK id_cmp de lote

// Registra nueva Compra y actualiza el lote asociado
// POST /api/compra/registrar

const crear = async (req, res, next) => {
  const { codigo_cpr, id_lte, precio_kilo_final, precio_total, fecha } =
    req.body;

  try {
    const loteVerificar = await lote.findById(id_lte).select("id_cmp");

    if (!loteVerificar) {
      return res.status(404).json({ mensaje: "Lote no encontrado." });
    }

    if (loteVerificar.id_cmp !== null) {
      return res.json({
        mensaje: "El lote ya fue comprado y no está disponible.",
      });
    }

    const nuevaCompra = new compra({
      codigo_cpr,
      precio_kilo_final,
      precio_total,
      fecha,
    });

    await nuevaCompra.save();

    res.json({
      mensaje: "Se creo la compra",
      nuevaCompra,
    });

    const loteAsignado = await lote.findByIdAndUpdate(
      id_lte,
      { $set: { id_cmp: nuevaCompra._id } },
      { new: true }
    );

    if (!loteAsignado) {
      return res
        .status(404)
        .json({ mensaje: "Lote no encontrado, compra no procesada." });
    }

    res.json({
      mensaje: "Se creó la compra y se actualizó el lote.",
      compra: nuevaCompra,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ mensaje: "Error al crear la compra", error: error.message });
    next(error);
  }
};

// Consulta todas las Compras, con populate mostramos a que Comprador se referencia
// GET /api/compra/consulta

const consulta = async (req, res, next) => {
  try {
    const compras = await compra.find({}).populate({
      path: "codigo_cpr",
      select: "nombre apellido_paterno",
    });
    res.json(compras);
  } catch (error) {
    console.log(error);
    next();
  }
};

// Consulta una Compra por ID
// GET /api/compra/consulta/:id

const consultaId = async (req, res, next) => {
  try {
    const compraID = await compra.findById(req.params.id).populate({
      path: "codigo_cpr",
      select: "nombre apellido_paterno correo",
    });
    if (!compraID) {
      return res.status(404).json({
        mensaje: "La compra no existe",
      });
    }
    res.json(compraID);
  } catch (error) {
    res.status(500).send(error.message);
    next(error);
  }
};

// Actualiza una Compra existente (Actualiza el lote en caso de que se cambie)
// PUT /api/compra/actualizar/:id

const actualizar = async (req, res) => {
  const id = req.params.id;
  const { codigo_cpr, id_lte, precio_kilo_final, precio_total, fecha } =
    req.body;

  try {
    const compraActualizada = await compra.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          codigo_cpr,
          precio_kilo_final,
          precio_total,
          fecha,
        },
      },
      { new: true }
    );

    const loteActualizado = await lote.findByIdAndUpdate(
      id_lte,
      { $set: { id_cmp: compraActualizada._id } },
      { new: true }
    );

    res.json({
      mensaje: "Compra actualizada",
      compraActualizada,
      loteActualizado,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ mensaje: "Error al actualizar la compra", error: error.message });
  }
};

// Elimina la Compra y libera el lote asociado
// DELETE /api/compra/eliminar/:id

const eliminar = async (req, res) => {
  const id = req.params.id;
  const compraEliminada = await compra.findOneAndDelete({ _id: id });
  try {
    if (!compraEliminada) {
      return res.status(404).json({ mensaje: "Compra no encontrada" });
    }

    await lote.findOneAndUpdate({ id_cmp: id }, { $set: { id_cmp: null } });

    res.json({ mensaje: "Compra eliminada y Lote liberado" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ mensaje: "Error al eliminar la compra", error: error.message });
  }
};

export { crear, actualizar, eliminar, consulta, consultaId };
