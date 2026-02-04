// src/controllers/empleado.controller.ts
import { Request, Response, NextFunction } from 'express';
import Empleado from '../models/empleado.model';

export async function getEmpleados(req: Request, res: Response): Promise<void> {
  try {
    const lista = await Empleado.find();
    res.json(lista);
  } catch {
    res.status(500).json({ message: 'Error al obtener empleados' });
  }
}

export async function getEmpleadoById(req: Request, res: Response): Promise<void> {
  try {
    const emp = await Empleado.findById(req.params.id);
    if (!emp) {
      res.status(404).json({ message: 'Empleado no encontrado' });
      return;
    }
    res.json(emp);
  } catch {
    res.status(500).json({ message: 'Error al obtener empleado' });
  }
}

export async function updateEmpleadoCalendario(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const { id } = req.params;
  const { mes, dia, turno } = req.body as {
    mes: number;
    dia: number;
    turno: 'M' | 'T' | 'L';
  };

  if (
    mes < 0 || mes > 11 ||
    dia < 1 || dia > 31 ||
    !['M', 'T', 'L'].includes(turno)
  ) {
    res.status(400).json({ message: 'Datos inválidos' });
    return;
  }

  try {
    const emp = await Empleado.findById(id);
    if (!emp) {
      res.status(404).json({ message: 'Empleado no encontrado' });
      return;
    }

    // Si por migración o datos antiguos faltan meses, los añadimos
    while (emp.calendario.length < 12) {
      emp.calendario.push({ days: new Map<string, typeof turno>() });
    }

    const monthDoc = emp.calendario[mes];
    // Aseguramos que days sea un Map (por si fuera un objeto JS)
    if (!(monthDoc.days instanceof Map)) {
      monthDoc.days = new Map(Object.entries(monthDoc.days));
    }

    // Ahora sí podemos setear
    monthDoc.days.set(String(dia), turno);
    await emp.save();

    res.json({ message: 'Turno actualizado' });
  } catch (err) {
    next(err);
  }
};
