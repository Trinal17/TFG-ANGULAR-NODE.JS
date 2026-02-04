// src/routes/auth.routes.ts
import { Router } from 'express';
import { login, updateProfile } from '../controllers/auth.controller';

const router = Router();

router.post('/login', login);

router.put('/profile/:id', updateProfile);

export default router;
