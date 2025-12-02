import { compra } from "../models/compra.js";

const generarReporteDiario = async (req, res, next) => {
  const { fecha } = req.query;

  if (!fecha) {
    return res
      .status(400)
      .json({ mensaje: "El parámetro 'fecha' es obligatorio (YYYY-MM-DD)." });
  }

  const fechaInicioUTC = new Date(`${fecha}T00:00:00.000Z`);

  const fechaFinUTC = new Date(fechaInicioUTC.getTime() + 24 * 60 * 60 * 1000);
  try {
    const reporte = await compra.aggregate([
      {
        $match: {
          activo: true,
          fecha: {
            $gte: fechaInicioUTC,
            $lt: fechaFinUTC,
          },
        },
      },
      {
        $lookup: {
          from: "comprador",
          localField: "codigo_cpr",
          foreignField: "_id",
          as: "clienteDetalle",
        },
      },
      { $unwind: "$clienteDetalle" },

      {
        $lookup: {
          from: "lote",
          localField: "_id",
          foreignField: "id_cmp",
          as: "loteAsociado",
        },
      },
      { $unwind: "$loteAsociado" },

      {
        $lookup: {
          from: "especie",
          localField: "loteAsociado._id",
          foreignField: "id_lte",
          as: "especieDetalle",
        },
      },
      { $unwind: "$especieDetalle" },

      {
        $lookup: {
          from: "tipo",
          localField: "especieDetalle.id_tpo",
          foreignField: "_id",
          as: "tipoDetalle",
        },
      },
      { $unwind: "$tipoDetalle" },

      {
        $project: {
          _id: "$_id",

          hora: { $dateToString: { format: "%H:%M", date: "$fecha" } },
          cliente: {
            $concat: [
              "$clienteDetalle.nombre",
              " ",
              "$clienteDetalle.apellido_paterno",
            ],
          },
          especie: "$especieDetalle.nombre",
          tipo: "$tipoDetalle.nombre",

          kilos: "$loteAsociado.kilos",
          total: "$precio_total",
        },
      },
    ]);

    res.json(reporte);
  } catch (error) {
    console.error("Error en la consulta de reporte diario:", error);
    res.status(500).json({
      mensaje: "Error al generar el reporte diario.",
      error: error.message,
    });
    next(error);
  }
};

export { generarReporteDiario };
