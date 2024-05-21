import { PrismaClient, Article } from '@prisma/client';
import bcrypt from 'bcrypt';
import { Context } from './context';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET;

interface CreateArticleArgs {
  title: string;
  content: string;
}

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
    myArticles: async (_: void, __: void, context: Context) => {
      if (!context.userId) {
        throw new Error('Not authenticated');
      }
      return await prisma.article.findMany({
        where: {
          authorId: context.userId,
        },
      });
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

      const token = jwt.sign({ userId: user.id }, JWT_SECRET as string);

      return token;
    },
    createArticle: async (_parent: {}, args: CreateArticleArgs, context: Context): Promise<Article> => {
      if (!context.userId) {
        throw new Error('Not authenticated');
      }

      const article = await context.prisma.article.create({
        data: {
          title: args.title,
          content: args.content,
          author: { connect: { id: context.userId } },
        },
        include: {
          author: true,
        },
      });
      return article;
    },
    deleteArticle: async (_: void, { id }: { id: number }, { userId }: { userId: number }) => {
      const article = await prisma.article.findUnique({ where: { id } });
      if (!article) {
        throw new Error('Article not found');
      }
      if (article.authorId !== userId) {
        throw new Error('Not authorized');
      }
      return await prisma.article.delete({ where: { id } });
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
