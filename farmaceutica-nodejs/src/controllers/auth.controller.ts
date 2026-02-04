// src/controllers/auth.controller.ts
import { Request, Response } from 'express';
import Usuario from '../models/usuario.model';

export const login = async (req: Request, res: Response): Promise<void> => {
  const { correo, password } = req.body;
  try {
    // 1) Buscar en la colección “usuarios”
    const user = await Usuario.findOne({ correo }).lean();
    if (!user || user.password !== password) {
      res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
      return;
    }
    // 2) Excluir password antes de devolver
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userSafe } = user;
    res.json(userSafe);
  } catch (err) {
    console.error('Error en login:', err);
    res.status(500).json({ message: 'Error en autenticación' });
  }
};

export const updateProfile = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { nombre, apellidos, password: newPassword } = req.body;
  
    try {
      const user = await Usuario.findById(id);
      if (!user) {
        res.status(404).json({ message: 'Usuario no encontrado' });
        return;
      }
  
      // Actualizamos sólo los campos permitidos
      user.nombre    = nombre;
      user.apellidos = apellidos;
      
      if (newPassword && newPassword.trim() !== '') {
        user.password = newPassword;
      }

      const saved = await user.save();
  
      // usamos destructuring para quitar el password
      const { password, ...userSafe } = saved.toObject();
      res.json(userSafe);
    } catch (err) {
      console.error('Error actualizando perfil:', err);
      res.status(500).json({ message: 'Error al actualizar perfil' });
    }
};
