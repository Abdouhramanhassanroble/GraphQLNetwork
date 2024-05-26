import { gql } from 'apollo-server';

const typeDefs = gql`
  type User {
    id: Int!
    email: String!
    articles: [Article!]!
    comments: [Comment!]!
    likes: [Like!]!
  }

  type Article {
    id: Int!
    title: String!
    content: String!
    author: User!
    comments: [Comment!]!
    likes: [Like!]!
  }

  type Comment {
    id: Int!
    content: String!
    article: Article!
    author: User!
  }

  type Like {
    id: Int!
    article: Article!
    user: User!
  }
  
  type Query {
    users: [User!]!
    articles: [Article!]!
    comments: [Comment!]!
    likes: [Like!]!
    myArticles: [Article!]!
    article(id: Int!): Article
  }

  type Mutation {
    createUser(email: String!, password: String!): User
    login(email: String!, password: String!): String
    createArticle(title: String!, content: String!): Article
    createComment(content: String!, articleId: Int!): Comment
    deleteComment(id: Int!): Comment
    likeArticle(articleId: Int!): Like
    unLikeArticle(articleId: Int!): Like
    deleteArticle(id: Int!): Article
  }
`;

export default typeDefs;