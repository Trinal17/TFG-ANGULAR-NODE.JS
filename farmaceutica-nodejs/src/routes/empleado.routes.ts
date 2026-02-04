import { Router } from 'express';
import {
  getEmpleados,
  getEmpleadoById,
  updateEmpleadoCalendario
} from '../controllers/empleado.controller';

const router = Router();

router.get('/',          getEmpleados);
router.get('/:id',       getEmpleadoById);
router.put('/:id/calendario', updateEmpleadoCalendario);

export default router;
