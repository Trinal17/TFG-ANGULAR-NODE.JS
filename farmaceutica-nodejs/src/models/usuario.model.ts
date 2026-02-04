// src/models/usuario.model.ts
import { Schema, model } from 'mongoose';

const UsuarioSchema = new Schema({
  nombre:     { type: String, required: true },
  apellidos:  { type: String, required: true },
  correo:     { type: String, required: true, unique: true },
  password:   { type: String, required: true },  // asegúrate de renombrar “contraseña” a “password” en la BD
  rol:        { type: String, required: true }
}, {
  collection: 'usuarios',  // conecta con la colección “usuarios”
  versionKey: false
});

export default model('Usuario', UsuarioSchema);
