import mongoose from 'mongoose';
import { lote } from "../models/lote.js";
import { especie } from "../models/especie.js";
import { tipo } from "../models/tipo.js";

//Va a regadistrar tanto especie como lote
// POST /api/lote-especie/registrar
const crear = async (req, res, next) => {
  const { kilos, numero_cajas, precio_kilo_salida, nombre, id_tpo, imagen } =
    req.body;

  try {
    const nuevoLote = new lote({
      kilos: kilos,
      numero_cajas: numero_cajas,
      precio_kilo_salida: precio_kilo_salida,
      fecha: new Date(),
      id_cmp: null,
      activo: true,
    });
    await nuevoLote.save();
    try {
      const nuevaEspecie = new especie({
        nombre: nombre,
        id_tpo: id_tpo,
        imagen: imagen,
        id_lte: nuevoLote._id,
        activo: true,
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
          activo: true,
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
          "loteDetalle.activo": true,
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
    res.status(500).json({
      mensaje: "Error al cargar lotes por tipo.",
      error: error.message,
    });
    next(error);
  }
};

const consultaId = async (req, res, next) => {
    const idLote = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(idLote)) {
        return res.status(400).json({ mensaje: "Formato de ID de Lote inválido." });
    }
    const loteObjectId = new mongoose.Types.ObjectId(idLote);

    try {
        const resultadoLote = await lote.aggregate([
            {
                $match: {
                    _id: loteObjectId,
                    activo: true, // Filtro de Soft Delete
                },
            },

            {
                $lookup: {
                    from: 'especie', // Colección singular
                    localField: '_id', // PK del Lote
                    foreignField: 'id_lte', // FK en Especie
                    as: 'especieDetalle',
                },
            },
            { $unwind: '$especieDetalle' }, 

            {
                $lookup: {
                    from: 'tipo', // Colección singular
                    localField: 'especieDetalle.id_tpo',
                    foreignField: '_id',
                    as: 'tipoDetalle',
                },
            },
            { $unwind: '$tipoDetalle' },

            {
                $project: {
                    _id: '$_id', // ID del Lote
                    kilos: '$kilos',
                    numero_cajas: '$numero_cajas',
                    precio_kilo_salida: '$precio_kilo_salida',
                    fecha: '$fecha',
                    activo: '$activo',
                    id_cmp: '$id_cmp',
                    
                    nombre: '$especieDetalle.nombre', // nombre_especie
                    imagen: '$especieDetalle.imagen', // imagen_especie
                    
                    tipo: '$tipoDetalle.nombre', // tipo_especie
                    
                    id_tpo_real: '$tipoDetalle._id', // ID real del Tipo para la actualización
                }
            },
            
            { $limit: 1 }
        ]);

        if (resultadoLote.length === 0) {
            return res.status(404).json({ mensaje: "Lote no encontrado o inactivo." });
        }
        res.json(resultadoLote[0]); 

    } catch (error) {
        console.error("Error en consultaId del Lote:", error);
        res.status(500).json({ mensaje: "Error al consultar el Lote.", error: error.message });
        next(error);
    }
};

const actualizar = async (req, res, next) => {
  const idLote = req.params.id;
  const { kilos, numero_cajas, precio_kilo_salida } = req.body;
  const { nombre, id_tpo, imagen } = req.body;

  try {
    const loteUpdate = {
      kilos,
      numero_cajas,
      precio_kilo_salida,
    };

    const loteActualizado = await lote.findByIdAndUpdate(
      {_id: idLote, activo: true},
      { $set: loteUpdate },
      { new: true }
    );

    if (!loteActualizado) {
      return res
        .status(404)
        .json({ mensaje: "Lote no encontrado para actualizar." });
    }

    const especieUpdate = {
      nombre,
      id_tpo,
      imagen,
    };

    const especieActualizada = await especie.findOneAndUpdate(
      { id_lte: idLote, activo: true },
      { $set: especieUpdate },
      { new: true }
    );

    if (!especieActualizada) {
      return res
        .status(404)
        .json({ mensaje: "No se encontró la Especie asociada al Lote." });
    }

    res.json({
      mensaje: "Lote y Especie actualizados correctamente.",
      lote: loteActualizado,
      especie: especieActualizada,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al actualizar Lote y Especie. ",
      error: error.message,
    });
    next(error);
  }
};

// DELETE /api/lote-especie/eliminar/:id (Soft Delete)
const eliminar = async (req, res, next) => {
    const idLote = req.params.id;

    try {

        const loteVerificar = await lote.findById(idLote).select("id_cmp activo");

        if (!loteVerificar || loteVerificar.activo === false) {

            return res.status(404).json({ mensaje: "Lote no encontrado o ya está inactivo." });
        }

        if (loteVerificar.id_cmp !== null) {
            return res.status(400).json({ 
                mensaje: "No se puede eliminar el lote: ya tiene una compra activa asociada." 
            });
        }

        const loteOculto = await lote.findOneAndUpdate(
            { _id: idLote, activo: true },
            { $set: { activo: false } },
            { new: true }
        );

        const especieOculta = await especie.findOneAndUpdate(
            { id_lte: idLote, activo: true },
            { $set: { activo: false } },
            { new: true}
        );

        if (!especieOculta) {
             return res.status(404).json({ mensaje: "Error: Especie asociada no encontrada." });
        }
        res.json({
            mensaje: "Lote y Especie desactivados (Soft Delete) correctamente.",
        });

    } catch (error) {
        
        console.error("Error al eliminar:", error);
        
        res.status(500).json({
            mensaje: "Error al desactivar Lote y Especie.",
            error: error.message,
        });
        next(error);
    }
};

export { crear, consultaTipo, actualizar, eliminar, consultaId };
