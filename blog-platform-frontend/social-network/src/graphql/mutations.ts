import gql from 'graphql-tag';

export const CREATE_ARTICLE = gql`
  mutation CreateArticle($title: String!, $content: String!) {
    createArticle(title: $title, content: $content) {
      id
      title
      content
      author {
        id
        email
      }
    }
  }
`;

export const DELETE_ARTICLE = gql`
  mutation DeleteArticle($id: Int!) {
    deleteArticle(id: $id) {
      id
      title
    }
  }
`;

export const CREATE_COMMENT = gql`
  mutation CreateComment($content: String!, $articleId: Int!) {
    createComment(content: $content, articleId: $articleId) {
      id
      content
      author {
        id
        email
      }
    }
  }
`;

export const DELETE_COMMENT = gql`
  mutation DeleteComment($id: Int!) {
    deleteComment(id: $id) {
      id
    }
  }
`;

export const LIKE_ARTICLE = gql`
  mutation LikeArticle($articleId: Int!) {
    likeArticle(articleId: $articleId) {
      id
      article {
        id
        title
      }
      user {
        id
        email
      }
    }
  }
`;

export const UNLIKE_ARTICLE = gql`
  mutation UnLikeArticle($articleId: Int!) {
    unLikeArticle(articleId: $articleId) {
      id
      article {
        id
        title
      }
      user {
        id
        email
      }
    }
  }
`;