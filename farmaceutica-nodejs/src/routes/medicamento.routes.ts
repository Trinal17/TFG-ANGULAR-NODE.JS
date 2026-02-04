import { Router } from 'express';
import {
  getMedicamentos,
  getMedicamentoById,
  addMedicamento,
  updateMedicamento,
  deleteMedicamento
} from '../controllers/medicamento.controller';

const router = Router();

router.get('/', getMedicamentos);
router.get('/:id', getMedicamentoById);   
router.post('/', addMedicamento);
router.put('/:id', updateMedicamento);
router.delete('/:id', deleteMedicamento);

export default router;
