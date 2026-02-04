import { Schema, model } from 'mongoose';

const PedidoSchema = new Schema({
  numero_pedido:   { type: String, required: true },
  cantidad_pedida: { type: Number, required: true }
}, { _id: false });

const VentaSchema = new Schema({
  numero_receta:   { type: String, required: true },
  cantidad_vendida: { type: Number, required: true }
}, { _id: false });

const MedicamentoSchema = new Schema({
  nombre:   { type: String, required: true },
  cantidad: { type: Number, required: true },
  ubicacion:{ type: String, default: '' }, 
  tipo:     { type: String, default: '' },
  ingredientes: { type: [String], default: [] },
  descripcion: { type: String, default: '' },
  pedidos:  { type: [PedidoSchema], default: [] },
  ventas:   { type: [VentaSchema], default: [] },
  stock_minimo: { type: Number, default: 15 },
},
{
  versionKey: false,
}
);

const Medicamento = model('Medicamento', MedicamentoSchema);

export default Medicamento;
