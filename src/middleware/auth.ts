import { Request, Response, NextFunction } from 'express';
import { supabase } from '../services/supabase.service.js';
import { config } from '../config/env.js';

export interface AuthenticatedRequest extends Request {
  user?: any;
}

/**
 * Middleware pour exiger un jeton Bearer JWT Supabase valide
 */
export async function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  // En mode dév sans Supabase configuré, laisser passer le mockup
  if (!config.supabaseUrl || config.supabaseUrl.includes('dummy')) {
    req.user = { id: 'mock-user-123', email: 'merchant@reflex.bj' };
    return next();
  }

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: 'Accès non autorisé. Jeton JWT (Bearer token) manquant.'
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({
        success: false,
        error: 'Jeton JWT invalide ou expiré.'
      });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('Erreur authentification middleware:', err);
    return res.status(500).json({ success: false, error: 'Erreur d\'authentification serveur.' });
  }
}
