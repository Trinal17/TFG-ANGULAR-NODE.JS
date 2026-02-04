// src/controllers/proveedor.controller.ts
import { Request, Response } from 'express';
import Proveedor from '../models/proveedor.model';

export const getProveedores = async (req: Request, res: Response) => {
  try {
    const todos = await Proveedor.find();
    res.json(todos);
  } catch {
    res.status(500).json({ message: 'Error al obtener proveedores' });
  }
};

export const addPedidoToProveedor = async (req: Request, res: Response): Promise<void> => {
  const { codigo } = req.params;
  const { numero_pedido, nombre_medicamento, cantidad_pedida } = req.body;

  if (!numero_pedido || !nombre_medicamento || typeof cantidad_pedida !== 'number') {
    res.status(400).json({ message: 'Payload inválido' });
    return;
  }

  try {
    const prov = await Proveedor.findOne({ codigo });
    if (!prov) {
      res.status(404).json({ message: 'Proveedor no encontrado' });
      return;
    }

    prov.pedidos.push({ numero_pedido, nombre_medicamento, cantidad_pedida });
    await prov.save();
    res.json(prov);
  } catch (err) {
    console.error('Error en addPedidoToProveedor:', err);
    res.status(500).json({ message: 'Error al añadir pedido al proveedor' });
  }
};

export const removePedidoFromProveedor = async (req: Request, res: Response): Promise<void> => {
  const { codigo, numero } = req.params;
  if (!codigo || !numero) {
    res.status(400).json({ message: 'Faltan parámetros nombre o número' });
    return;
  }
  try {
    const prov = await Proveedor.findOne({ codigo });
    if (!prov) {
      res.status(404).json({ message: 'Proveedor no encontrado' });
      return;
    }
    // elimina el subdocumento sin reasignar el array
    prov.pedidos.remove({ numero_pedido: numero });
    await prov.save();
    res.json({ message: 'Pedido eliminado del proveedor' });
  } catch (err) {
    console.error('Error en removePedidoFromProveedor:', err);
    res.status(500).json({ message: 'Error al eliminar pedido del proveedor' });
  }
};

export const updatePedidoInProveedor = async (req: Request, res: Response): Promise<void> => {
  const { codigo, numero } = req.params;
  const { cantidad_pedida } = req.body;
  if (typeof cantidad_pedida !== 'number') {
    res.status(400).json({ message: 'Falta cantidad_pedida (number)' });
    return;
  }
  try {
    const prov = await Proveedor.findOne({ codigo });
    if (!prov) {
      res.status(404).json({ message: 'Proveedor no encontrado' });
      return;
    }
    // Encuentra el subdocumento y actualiza
    const ped = prov.pedidos.find(p => p.numero_pedido === numero);
    if (!ped) {
      res.status(404).json({ message: 'Pedido no hallado en proveedor' });
      return;
    }
    ped.cantidad_pedida = cantidad_pedida;
    await prov.save();
    res.json({ message: 'Cantidad actualizada en proveedor' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error actualizando pedido en proveedor' });
  }
};