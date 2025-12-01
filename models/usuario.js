import mongoose, { model } from "mongoose";
import bcrypt from 'bcrypt';
const Schema = mongoose.Schema;

mongoose.pluralize(null);
const usuarioSchema = new Schema({
  nombre: {
    type: String,
    required: true,
  },
  ap_paterno: {
    type: String,
    required: true,
  },
  ap_materno: {
    type: String,
    required: true,
  },
  correo: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  rol: {
    type: String,
    enum: ["admin", "vendedor"],
    default: "vendedor",
    required: true,
  },
});

usuarioSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    return next(error);
  }
});

usuarioSchema.methods.comparePassword = function (passwordFormulario) {
  return bcrypt.compareSync(passwordFormulario, this.password);
};

const usuario = mongoose.model("usuario", usuarioSchema);

export { usuario };
