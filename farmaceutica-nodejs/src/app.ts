import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import medicamentoRoutes from './routes/medicamento.routes';
import pedidoRoutes from './routes/pedido.routes';
import proveedorRoutes from './routes/proveedor.routes';
import authRouter from './routes/auth.routes';
import empleadoRouter from './routes/empleado.routes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/medicamentos', medicamentoRoutes);
app.use('/pedidos', pedidoRoutes);
app.use('/proveedores', proveedorRoutes);
app.use('/auth', authRouter);
app.use('/empleados', empleadoRouter);

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI!)
  .then(() => {
    console.log('Conectado a MongoDB');
    app.listen(port, () => {
      console.log(`Servidor corriendo en http://localhost:${port}`);
    });
  })
  .catch(err => console.error('Error al conectar a MongoDB', err));
