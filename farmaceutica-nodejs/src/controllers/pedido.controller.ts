// src/controllers/pedido.controller.ts
import { Request, Response } from 'express';
import Pedido from '../models/pedido.model';
import Proveedor from '../models/proveedor.model';

export const getPedidos = async (req: Request, res: Response): Promise<void> => {
  try {
    // Carga sencilla de todos los pedidos sin ningún join
    const pedidos = await Pedido.find();
    res.json(pedidos);
  } catch (error) {
    console.error('Error al obtener pedidos:', error);
    res.status(500).json({ message: 'Error al obtener pedidos' });
  }
};

export const getPedidoByNumero = async (req: Request, res: Response): Promise<void> => {
  const { numero } = req.params;
  try {
    const pedido = await Pedido.findOne({ numero_pedido: numero }).lean();
    if (!pedido) {
      res.status(404).json({ message: 'Pedido no encontrado' });
      return;
    }
    res.json(pedido);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al buscar pedido' });
  }
};

export const addPedido = async (req: Request, res: Response) => {
  try {
    const { numero_pedido, nombre_medicamento, cantidad_pedida, codigo_proveedor } = req.body;
    const nuevo = new Pedido({ numero_pedido, nombre_medicamento, cantidad_pedida, codigo_proveedor });
    const saved = await nuevo.save();
    res.status(201).json(saved);
  } catch {
    res.status(500).json({ message: 'Error al crear pedido' });
  }
};

export const updatePedido = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const { cantidad_pedida } = req.body;
      const ped = await Pedido.findById(id);
  
      if (!ped) {
        res.status(404).json({ message: 'Pedido no encontrado' });
        return; // <-- nada de return res..., solo return;
      }
  
      ped.cantidad_pedida = cantidad_pedida;
      await ped.save();
  
      res.json(ped);
      return;   // <-- explícito, aunque opcional
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al actualizar pedido' });
      return;
    }
  };

export const deletePedido = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await Pedido.findByIdAndDelete(id);
    res.json({ message: 'Pedido eliminado' });
  } catch {
    res.status(500).json({ message: 'Error al eliminar pedido' });
  }
};
