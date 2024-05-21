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
