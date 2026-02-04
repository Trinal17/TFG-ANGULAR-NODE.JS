// src/routes/pedido.routes.ts
import { Router } from 'express';
import {
  getPedidos,
  addPedido,
  updatePedido,
  deletePedido,
  getPedidoByNumero,
} from '../controllers/pedido.controller';

const router = Router();

// Listar todos
router.get('/', getPedidos);

// Crear nuevo
router.post('/', addPedido);

// Actualizar cantidad de un pedido
router.put('/:id', updatePedido);

// Borrar un pedido
router.delete('/:id', deletePedido);

router.get('/numero/:numero', getPedidoByNumero);

export default router;
