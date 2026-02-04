// src/routes/proveedor.routes.ts
import { Router } from 'express';
import { getProveedores, addPedidoToProveedor, removePedidoFromProveedor, updatePedidoInProveedor } from '../controllers/proveedor.controller';

const router = Router();

router.get('/', getProveedores);
router.post('/:codigo/pedidos', addPedidoToProveedor);
router.delete('/:codigo/pedidos/:numero', removePedidoFromProveedor);
router.put('/:codigo/pedidos/:numero', updatePedidoInProveedor);

export default router;
