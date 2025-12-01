import { compra } from "../models/compra.js";
import { lote } from "../models/lote.js"; //Necesario para actualizar FK id_cmp de lote

// Registra nueva Compra y actualiza el lote asociado
// POST /api/compra/registrar

const crear = async (req, res, next) => {
  const { codigo_cpr, id_lte, precio_kilo_final, precio_total } = req.body;

  try {
    const loteVerificar = await lote.findById(id_lte).select("id_cmp activo");

    if (!loteVerificar || loteVerificar.activo === false) {
      return res
        .status(404)
        .json({ mensaje: "Lote no encontrado o inactivo." });
    }

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
      fecha: new Date(),
    });

    await nuevaCompra.save({});

    const loteAsignado = await lote.findByIdAndUpdate(
      id_lte,
      { $set: { id_cmp: nuevaCompra._id } },
      { new: true }
    );

    if (!loteAsignado) {
      return res.json({ mensaje: "Lote no encontrado, compra no procesada." });
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
    const compras = await compra.find({ activo: true }).populate({
      path: "codigo_cpr",
      select: "nombre apellido_paterno",
    });
    res.json(compras);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        mensaje: "Error al consultar las compras",
        error: error.message,
      });
    next();
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
      { _id: id, activo: true },
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

    const loteAnterior = await lote.findOne({ id_cmp: id });

    if (loteAnterior && loteAnterior._id.toString() !== id_lte) {
      await lote.findByIdAndUpdate(loteAnterior._id, {
        $set: { id_cmp: null },
      });
    }

    if (id_lte && (!loteAnterior || loteAnterior._id.toString() !== id_lte)) {
      const loteNuevoVerificar = await lote.findById(id_lte).select("id_cmp");

      if (!loteNuevoVerificar) {
        return res.status(404).json({ mensaje: "Nuevo Lote no encontrado." });
      }

      if (loteNuevoVerificar.id_cmp !== null) {
        return res.json({
          mensaje:
            "El nuevo lote seleccionado ya está comprado por otra transacción.",
        });
      }

      var loteAsignado = await lote.findByIdAndUpdate(
        id_lte,
        { $set: { id_cmp: id } },
        { new: true }
      );
    } else if (loteAnterior && loteAnterior._id.toString() === id_lte) {
      var loteAsignado = loteAnterior;
    }

    res.json({
      mensaje: "Compra actualizada",
      compraActualizada,
      loteAsignado,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ mensaje: "Error al actualizar la compra", error: error.message });
  }
};

// Oculta (Soft Delete) la Compra y libera el lote asociado
// DELETE /api/compra/eliminar/:id

const eliminar = async (req, res) => {
  const id = req.params.id;
  try {
    const compraOculta = await compra.findOneAndUpdate(
      { _id: id, activo: true },
      { $set: { activo: false } },
      { new: true }
    );

    if (!compraOculta) {
      return res
        .status(404)
        .json({ mensaje: "Compra no encontrada o ya está inactiva." });
    }

    await lote.findOneAndUpdate({ id_cmp: id }, { $set: { id_cmp: null } });

    res.json({ mensaje: "Compra desactivada (Soft Delete) y Lote liberado" });
  } catch (error) {
    console.error("Error al eliminar compra (Transacción abortada):", error);
    res
      .status(500)
      .json({ mensaje: "Error al eliminar la compra", error: error.message });
  }
};

export { crear, actualizar, eliminar, consulta };
