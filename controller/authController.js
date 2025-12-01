import { usuario } from "../models/usuario.js";


// GET authController.js (Fragmento de la función login)

const autenticarUsuario = async (req, res, next) => {
    const { correo, password } = req.body;
    
    const user = await usuario.findOne({ correo });

    if (!user) {
        return res.status(401).json({ mensaje: 'Usuario o Contraseña incorrectos' });
    }

    if (!user.comparePassword(password)) {
        return res.status(401).json({ mensaje: 'Usuario o Contraseña incorrectos' });
    }

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
    const usuarios = await usuario.find({});
    res.json(usuarios);
  } catch (error) {
    console.log(error);
    next();
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
  const { nombre, ap_paterno, ap_materno, correo } = req.body;

  const usuarios = await usuario.findOneAndUpdate(
    { _id: id },
    {
      $set: {
        nombre: nombre,
        ap_paterno: ap_paterno,
        ap_materno: ap_materno,
        password: password
      },
    },
    { new: true }
  );

  res.json({ mensaje: "Usuario actualizado", usuarios });
};

const eliminar = async (req, res) => {
  const id = req.params.id;
  const usuarios = await usuario.findOneAndDelete({ _id: id });

  if (usuarios) {
    res.json({ mensaje: "Usuario borrado" });
  }
};

export { crear, actualizar, eliminar, consulta, consultaId, autenticarUsuario };
