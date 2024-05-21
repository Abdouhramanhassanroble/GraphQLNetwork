import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface Context {
    prisma: PrismaClient;
    userId?: number;
  }  


const context = async ({ req }: { req: any }) => {
  // Extraction du token JWT depuis les en-têtes de requête
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '');
  let userId ;

  if (token) {
    try {
      // Vérification du token JWT
      const { userId: id } = jwt.verify(token, 'JWT_SECRET') as { userId: number };
        userId = id;
    } catch (error) {
        console.error('Token invalide', error);
        }
    }
    return {
        prisma,
        userId,
    };
    
};

export default context;
