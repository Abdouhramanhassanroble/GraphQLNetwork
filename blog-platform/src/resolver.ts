import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = 'votre_secret_jwt';

const resolvers = {
  Query: {
    users: async () => {
      return await prisma.user.findMany();
    },
    articles: async () => {
      return await prisma.article.findMany();
    },
    comments: async () => {
      return await prisma.comment.findMany();
    },
    likes: async () => {
      return await prisma.like.findMany();
    },
  },
  Mutation: {
    createUser: async (_: void, args: { email: string, password: string }) => {
      const { email, password } = args;
      const hashedPassword = await bcrypt.hash(password, 10);
      return await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
        },
      });
    },
    login: async (_: void, { email, password }: { email: string, password: string }) => {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        throw new Error('Utilisateur non trouvé');
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        throw new Error('Mot de passe incorrect');
      }

      // Génération du token JWT
      return jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
    },
    createArticle: async (_: void, { title, content }: { title: string, content: string }, { userId }: { userId: number }) => {
      return await prisma.article.create({
        data: {
          title,
          content,
          author: { connect: { id: userId } },
        },
      });
    },
    createComment: async (_: void, { content, articleId }: { content: string, articleId: number }, { userId }: { userId: number }) => {
      return await prisma.comment.create({
        data: {
          content,
          article: { connect: { id: articleId } },
          author: { connect: { id: userId } },
        },
      });
    },
    likeArticle: async (_: void, { articleId }: { articleId: number }, { userId }: { userId: number }) => {
      return await prisma.like.create({
        data: {
          article: { connect: { id: articleId } },
          user: { connect: { id: userId } },
        },
      });
    },
  },
  User: {
    articles: async (parent: { id: number }) => {
      return await prisma.user.findUnique({ where: { id: parent.id } }).articles();
    },
    comments: async (parent: { id: number }) => {
      return await prisma.user.findUnique({ where: { id: parent.id } }).comments();
    },
    likes: async (parent: { id: number }) => {
      return await prisma.user.findUnique({ where: { id: parent.id } }).likes();
    },
  },
  Article: {
    author: async (parent: { id: number }) => {
      return await prisma.article.findUnique({ where: { id: parent.id } }).author();
    },
    comments: async (parent: { id: number }) => {
      return await prisma.article.findUnique({ where: { id: parent.id } }).comments();
    },
    likes: async (parent: { id: number }) => {
      return await prisma.article.findUnique({ where: { id: parent.id } }).likes();
    },
  },
  Comment: {
    article: async (parent: { id: number }) => {
      return await prisma.comment.findUnique({ where: { id: parent.id } }).article();
    },
    author: async (parent: { id: number }) => {
      return await prisma.comment.findUnique({ where: { id: parent.id } }).author();
    },
  },
  Like: {
    article: async (parent: { id: number }) => {
      return await prisma.like.findUnique({ where: { id: parent.id } }).article();
    },
    user: async (parent: { id: number }) => {
      return await prisma.like.findUnique({ where: { id: parent.id } }).user();
    },
  },
};

export default resolvers;
