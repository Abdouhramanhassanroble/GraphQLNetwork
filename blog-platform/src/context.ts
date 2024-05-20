import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const JWT_SECRET = 'votre_secret_jwt';

const context = async ({ req }: { req: any }) => {
  // Extraction du token JWT depuis les en-têtes de requête
  const token = req.headers.authorization || '';

  try {
    // Vérification et décryptage du token JWT
    const { userId } = jwt.verify(token, JWT_SECRET) as { userId: number };
    
    // Retourner le PrismaClient et les données utilisateur pour le contexte
    return {
      prisma,
      userId,
    };
  } catch (error) {
    // En cas d'erreur, retourner seulement le PrismaClient sans l'identifiant utilisateur
    return {
      prisma,
    };
  }
};

export default context;
