import { PrismaClient } from '@prisma/client';
import { IncomingMessage } from 'http';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export interface Context {
  prisma: PrismaClient;
  userId?: number;
}

export const context = async ({ req }: { req: IncomingMessage }): Promise<Context> => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '');
  let userId;
  if (token) {
    try {
      const user = jwt.verify(token, 'JWT_SECRET') as { userId: number };
      userId = user.userId;
    } catch (e) {
      console.error('Invalid token');
    }
  }
  return { prisma, userId };
};