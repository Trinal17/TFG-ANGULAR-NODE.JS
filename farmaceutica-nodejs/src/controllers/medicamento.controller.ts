import { Request, Response } from 'express';
import Medicamento from '../models/medicamento.model';

// GET - obtener todos los medicamentos
export const getMedicamentos = async (req: Request, res: Response): Promise<void> => {
  try {
    const medicamentos = await Medicamento.find();
    res.json(medicamentos);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener medicamentos' });
  }
};

// GET - obtener un medicamento por ID
export const getMedicamentoById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const medicamento = await Medicamento.findById(id);
    if (!medicamento) {
      res.status(404).json({ message: 'Medicamento no encontrado' });
      return;
    }
    res.json(medicamento);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener medicamento' });
  }
};

// POST - agregar un nuevo medicamento
export const addMedicamento = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      nombre,
      ubicacion,
      tipo,
      descripcion = '',
      ingredientes = []
    } = req.body;

    const nuevoMedicamento = new Medicamento({
      nombre,
      ubicacion,
      cantidad: 0,
      tipo,
      descripcion,
      ingredientes,
      pedidos: [],  // array vacío
      ventas: []    // array vacío
    });

    const saved = await nuevoMedicamento.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al agregar medicamento' });
  }
};

// PUT - actualizar un medicamento
export const updateMedicamento = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { numeroPedido, cantidad } = req.body;

  try {
    const medicamento = await Medicamento.findById(id);
    if (!medicamento) {
      res.status(404).json({ message: 'Medicamento no encontrado' });
      return;
    }

    const numStr = numeroPedido?.toString() ?? '';
    if (numStr.length === 6) {
      // Es un pedido → sumamos
      medicamento.cantidad += cantidad;
      medicamento.pedidos.push({
        numero_pedido:   numeroPedido,
        cantidad_pedida: cantidad
      });
    } else if (numStr.length === 4) {
      // Es una venta → restamos
      medicamento.cantidad -= cantidad;
      // Aseguramos que exista el array ventas
      medicamento.ventas = medicamento.ventas || [];
      medicamento.ventas.push({
        numero_receta:    numeroPedido,
        cantidad_vendida: cantidad
      });
    } else {
      res.status(400).json({ message: 'Número inválido: debe tener 4 (venta) o 6 dígitos (pedido).' });
      return;
    }

    await medicamento.save();
    res.json(medicamento);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar medicamento' });
  }
};

// DELETE - eliminar un medicamento
export const deleteMedicamento = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    await Medicamento.findByIdAndDelete(id);
    res.json({ message: 'Medicamento eliminado' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar medicamento' });
  }
};
