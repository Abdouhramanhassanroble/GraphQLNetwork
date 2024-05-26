import gql from 'graphql-tag';

export const GET_USERS = gql`
  query GetUsers {
    users {
      id
      email
      articles {
        id
        title
      }
    }
  }
`;

export const GET_ARTICLES = gql`
  query GetArticles {
    articles {
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

export const GET_MY_ARTICLES = gql`
  query GetMyArticles {
    myArticles {
      id
      title
      content
    }
  }
`;

export const GET_ARTICLE_DETAILS = gql`
  query GetArticleDetails($id: Int!) {
    article(id: $id) {
      id
      title
      content
      author {
        id
        email
      }
      comments {
        id
        content
        author {
          id
          email
        }
      }
      likes {
        id
        user {
          id
          email
        }
      }
    }
  }
`;
