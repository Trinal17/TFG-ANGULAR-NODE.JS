// src/models/proveedor.model.ts
import { Schema, model } from 'mongoose';

const PedidoSchema = new Schema({
  numero_pedido:      { type: String, required: true },
  nombre_medicamento: { type: String, required: true },
  cantidad_pedida:    { type: Number, required: true }
}, { _id: false });

const ProveedorSchema = new Schema({
  codigo:    { type: String, required: true, unique: true },
  nombre:    { type: String, required: true },
  direccion: { type: String, default: '' },
  telefono:  { type: String, default: '' },
  email:     { type: String, default: '' },
  pedidos:   { type: [PedidoSchema], default: [] }
}, { versionKey: false, collection: 'proveedores', autoIndex: false });

export default model('Proveedor', ProveedorSchema);
