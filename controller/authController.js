import { usuario } from "../models/usuario.js";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';

// GET authController.js (Fragmento de la función login)
const autenticarUsuario = async (req, res, next) => {
  const { correo, password } = req.body;

  const user = await usuario.findOne({ correo });

  if (!user) {
    return res
      .status(401)
      .json({ mensaje: "Usuario o Contraseña incorrectos" });
  }

  if (!user.comparePassword(password)) {
    return res
      .status(401)
      .json({ mensaje: "Usuario o Contraseña incorrectos" });
  }

  const token = jwt.sign(
    {
      id: user._id,
      nombre: user.nombre,
      rol: user.rol,
    },
    process.env.JWT_SECRET,
    { expiresIn: "8h" }
  );

  res.json({
    token,
    usuario: {
      _id: user._id,
      nombre: user.nombre,
      rol: user.rol,
    },
  });
};

const crear = async (req, res, next) => {
  const datos = req.body;
  console.log(datos);
  const usuarios = new usuario(datos);
  try {
    await usuarios.save();
    res.json({
      mensaje: "Se creo el usuario",
    });
  } catch (error) {
    console.log(error);
    next();
  }
};

const consulta = async (req, res, next) => {
  try {
    const usuarios = await usuario.find({ activo: true }).select("-password");

    res.json(usuarios);
  } catch (error) {
    console.error("Error en consulta de usuarios:", error);
    res.status(500).json({ mensaje: "Error al consultar usuarios" });
    next(error);
  }
};

const consultaId = async (req, res, next) => {
  try {
    const usuarios = await usuario.findById(req.params.id);

    if (!usuarios) {
      res.json({
        mensaje: "El usuario no existe",
      });

      next;
    }

    res.json(usuarios);
  } catch (error) {
    res.send(error);

    next();
  }
};

const actualizar = async (req, res) => {
  const id = req.params.id;
  const { nombre, ap_paterno, ap_materno, correo, rol, password } = req.body; 

  try {
    let updateData = { nombre, ap_paterno, ap_materno, correo, rol };

    if (password) {
        const salt = await bcrypt.genSalt(10);
        updateData.password = await bcrypt.hash(password, salt);
    }

    const usuarios = await usuario.findOneAndUpdate(
      { _id: id, activo: true }, 
      { $set: updateData },
      { new: true, runValidators: true } 
    );

    if (!usuarios) {
      return res.status(404).json({ mensaje: "Usuario no encontrado o inactivo." });
    }

    const usuarioLimpio = usuarios.toObject();
    delete usuarioLimpio.password; 

    res.json({ mensaje: "Usuario actualizado", usuarios: usuarioLimpio });

  } catch (error) {
    if (error.code === 11000) {
        return res.status(400).json({ mensaje: "El correo ya está registrado por otro usuario." });
    }
    console.error("Error al actualizar usuario:", error);
    res.status(500).json({ mensaje: "Error al actualizar usuario" });
  }
};

const eliminar = async (req, res) => {
  const id = req.params.id;

  try {
    const usuarios = await usuario.findOneAndUpdate(
      { _id: id, activo: true },
      { $set: { activo: false } },
      { new: true }
    );

    if (!usuarios) {
      return res
        .status(404)
        .json({ mensaje: "Usuario no encontrado o ya estaba inactivo." });
    }

    res.json({ mensaje: "Usuario desactivado (Soft Delete) correctamente" });
  } catch (error) {
    console.error("Error al desactivar usuario:", error);
    res.status(500).json({ mensaje: "Error al eliminar usuario" });
  }
};

export { crear, actualizar, eliminar, consulta, autenticarUsuario, consultaId };
