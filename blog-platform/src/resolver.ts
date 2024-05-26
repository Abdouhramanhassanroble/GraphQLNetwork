import { PrismaClient, Article, User, Comment, Like } from '@prisma/client';
import bcrypt from 'bcrypt';
import { Context } from './context';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET;

interface CreateArticleArgs {
  title: string;
  content: string;
}

interface CreateCommentArgs {
  content: string;
  articleId: number;
}
interface ConnexionArgs {
  email: string;
  password: string;
}

interface LikeArticleArgs {
  articleId: number;
}


const resolvers = {
  Query: {
    users: async (_parent: {}, _args: {}, context: Context): Promise<User[]> => {
      return context.prisma.user.findMany();
    },
    articles: async (_parent: {}, _args: {}, context: Context): Promise<Article[]> => {
      return context.prisma.article.findMany({ include: { author: true, comments: { include: { author: true } }, likes: true } });
    },
    
    comments: async () => {
      return await prisma.comment.findMany();
    },
    likes: async () => {
      return await prisma.like.findMany();
    },
    myArticles: async (_parent: {}, _args: {}, context: Context): Promise<Article[]> => {
      if (!context.userId) {
        throw new Error('Not authenticated');
      }
      return context.prisma.article.findMany({
        where: { authorId: context.userId },
        include: { author: true, comments: { include: { author: true } }, likes: true },
      });
    
    },
    
    article: async (_parent: {}, args: { id: number }, context: Context): Promise<Article | null> => {
      try {
        const article = await context.prisma.article.findUnique({
          where: { id: args.id },
          include: { author: true, comments: { include: { author: true } }, likes: true },
        });
        return article;
      } catch (error) {
        console.error("Error fetching article by ID:", error);
        return null;
      }
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

    login: async (_parent: {}, args: ConnexionArgs, context: Context): Promise<string> => {
      console.log('Received login args:', args); 

      const user = await context.prisma.user.findUnique({ where: { email: args.email } });
      if (!user) {
        throw new Error('No such user found');
      }

      const valid = await bcrypt.compare(args.password, user.password);
      if (!valid) {
        throw new Error('Invalid password');
      }

      const token = jwt.sign({ userId: user.id }, 'JWT_SECRET');
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
    
      // Supprimer les commentaires associés à l'article
      await prisma.comment.deleteMany({ where: { articleId: id } });
    
      // Supprimer les likes associés à l'article
      await prisma.like.deleteMany({ where: { articleId: id } });
    
      // Enfin, supprimer l'article lui-même
      return await prisma.article.delete({ where: { id } });
    },
    
    createComment: async (_parent: {}, args: CreateCommentArgs, context: Context): Promise<Comment> => {

     return await prisma.comment.create({
        data: {
          content: args.content,
          article: { connect: { id: args.articleId } },
          author: { connect: { id: context.userId } },
        },
      });
    },

    deleteComment: async (_parent: {}, args: { id: number }, context: Context): Promise<Comment> => {
      const deletedComment = await prisma.comment.delete({ 
        where: { id: args.id } });
        return deletedComment;
    },
  

    likeArticle: async (_parent: {}, args: LikeArticleArgs, context: Context): Promise<Like> => {
      console.log('User Id:', context.userId);
      if (!context.userId) {
        throw new Error('Not authenticated');
      }
      const existingLike = await prisma.like.findFirst({
        where: {
          articleId: args.articleId,
          userId: context.userId,
        },
      });
      if (existingLike) {
        return await prisma.like.delete({
          where: {
            id: existingLike.id,
          },
        });
      }
      return await prisma.like.create({
        data: {
          article: { connect: { id: args.articleId } },
          user: { connect: { id: context.userId } },
        },
      });

    },

    unLikeArticle: async (_parent: {}, args: LikeArticleArgs, context: Context): Promise<Like | null> => {
      console.log('User Id:', context.userId);

      if (!context.userId) {
        throw new Error('Not authenticated');
      }
    
      const existingLike = await prisma.like.findFirst({
        where: {
          articleId: args.articleId,
          userId: context.userId,
        },
      });
    
      if (existingLike) {
        return await prisma.like.delete({
          where: {
            id: existingLike.id,
          },
        });
      } else {
        throw new Error('Like not found');
      }
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
