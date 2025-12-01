import { lote } from "../models/lote.js";

//Crear lote se encuentra en loteEspecie Controller, debido a la logica 1:N con especie

const consulta = async (req, res) => {
  try {
    const lotes = await lote.aggregate([
      {
        $lookup: {
          from: "especie",
          localField: "_id",
          foreignField: "id_lte",
          as: "especie"
        }
      },
      { $unwind: "$especie" },

      {
        $project: {
          _id: 1,
          kilos: "$kilos",
          cajas: "$numero_cajas",
          precio_kilo_salida: 1,
          especie: "$especie.nombre",
          imagen: "$especie.imagen",

          estado: {
            $cond: {
              if: { $eq: ["$id_cmp", null] },
              then: "Disponible",
              else: "Agotado"
            }
          }
        }
      }
    ]);

    res.json(lotes);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensaje: "Error al consultar lotes",
      error: error.message
    });
  }
};


const consultaId = async (req, res, next) => {
  try {
    const lotes = await lote.findById(req.params.id);
    if (!lotes) {
      return res.json({ mensaje: "El lote no existe" });
    }
    res.json(lotes);
  } catch (error) {
    next(error);
  }
};

const actualizar = async (req, res) => {
  const id = req.params.id;
  const { kilos, numero_cajas, precio_kilo_salida, fecha, id_cmp } = req.body;

  const lotes = await lote.findOneAndUpdate(
    { _id: id },
    {
      $set: { kilos, numero_cajas, precio_kilo_salida, fecha, id_cmp },
    },
    { new: true }
  );

  res.json({ mensaje: "Lote actualizado", lotes });
};

const eliminar = async (req, res) => {
  const id = req.params.id;
  const lotes = await lote.findOneAndDelete({ _id: id });

  if (lotes) {
    res.json({ mensaje: "Lote borrado" });
  }
};

export { actualizar, eliminar, consulta };
