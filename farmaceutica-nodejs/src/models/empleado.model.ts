// src/models/empleado.model.ts
import { Schema, model, Document, Types } from 'mongoose';
export type Turno = 'M'|'T'|'L';

const MonthSchema = new Schema({
  days: {
    type: Map,
    of: { type: String, enum: ['M','T','L'] },
    default: {}
  }
}, { _id: false });

export interface IEmpleado extends Document {
  nombre: string;
  apellidos: string;
  telefono: string;
  correo: string;
  calendario: Types.DocumentArray<{ days: Map<string,Turno> }>;
}

const EmpleadoSchema = new Schema<IEmpleado>({
  nombre:    { type: String, required: true },
  apellidos: { type: String, required: true },
  telefono:  { type: String, required: true },
  correo:    { type: String, required: true, unique: true },
  calendario: {
    type: [ MonthSchema ],
    // default COMO función: cada doc nuevo arranca con 12 meses vacíos
    default: () =>
      Array.from({ length: 12 }, () => ({ days: new Map<string,Turno>() }))
  }
}, { versionKey: false });

export default model<IEmpleado>('Empleado', EmpleadoSchema);
