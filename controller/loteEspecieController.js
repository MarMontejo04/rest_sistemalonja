import { lote } from "../models/lote.js";
import { especie } from "../models/especie.js";
import { compra } from "../models/compra.js";
import { tipo } from "../models/tipo.js";


// POST /api/lote-especie/registrar
const crear = async (req, res, next) => {
  const { kilos, numero_cajas, precio_kilo_salida, nombre, id_tpo, imagen } =
    req.body;

  try {
    const nuevoLote = new lote({
      kilos,
      numero_cajas,
      precio_kilo_salida,
      fecha: new Date(),
      id_cmp: null,
    });
    await nuevoLote.save();
    try {
      const nuevaEspecie = new especie({
        nombre: nombre,
        id_tpo: id_tpo,
        imagen: imagen,
        id_lte: nuevoLote._id,
      });

      await nuevaEspecie.save();

      res.status(201).json({
        mensaje: "Lote y Especie registrados correctamente.",
        lote: nuevoLote,
        especie: nuevaEspecie,
      });
    } catch (error) {
      await lote.findByIdAndDelete(nuevoLote._id);
      throw error;
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensaje: "Error al registrar Lote y Especie",
      error: error.message,
    });
    next(error);
  }
};

/**Esta función pedira el parametro nombre de tipo, buscará las especies con este tipo
 * y donde el lote tenga un id_cmp null (indicando que estan disponibles para su compra)
 * CUando la seleccuones te dara los detalles del lote y te dara la opcion de realizar la compra
 * /api/compra/registrar
  */

// GET /api/lote-especie/consulta-tpo
const consultaTipo = async (req, res, next) => {
  const { nombre: nombre } = req.params;

  try {
    const tipoEncontrado = await tipo.findOne({ nombre: nombre });
    const lotesDisponibles = await especie.aggregate([
      {
        $lookup: {
          from: "tipo", 
          localField: "id_tpo",
          foreignField: "_id",
          as: "tipoDetalle",
        },
      },
      { $unwind: "$tipoDetalle" },

      {
        $match: {
          "tipoDetalle.nombre": nombre,
        },
      },

      {
        $lookup: {
          from: "lote", 
          localField: "id_lte",
          foreignField: "_id",
          as: "loteDetalle",
        },
      },
      { $unwind: "$loteDetalle" },

      {
        $match: {
          "loteDetalle.id_cmp": { $eq: null },
        },
      },

      {
        $project: {
          _id: "$loteDetalle._id",
          especie: "$nombre",
          tipo: "$tipoDetalle.nombre",
          precio: "$loteDetalle.precio_kilo_salida",
          disponible: "$loteDetalle.kilos",
          cajas: "$loteDetalle.numero_cajas",
          imagen: "$imagen", 

        },
      },
    ]);

    res.json(lotesDisponibles);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        mensaje: "Error al cargar lotes por tipo.",
        error: error.message,
      });
    next(error);
  }
};

export { crear, consultaTipo };
