// src/models/pedido.model.ts
import { Schema, model } from 'mongoose';

const PedidoSchema = new Schema({
  numero_pedido:     { type: String, required: true, unique: true },
  nombre_medicamento:{ type: String, required: true },
  cantidad_pedida:   { type: Number, required: true },
  codigo_proveedor:  { type: String, required: true }
}, { versionKey: false });

export default model('Pedido', PedidoSchema);
