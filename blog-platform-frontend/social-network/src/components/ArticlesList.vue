<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useQuery, useMutation } from '@vue/apollo-composable';
import gql from 'graphql-tag';

const GET_ARTICLES = gql`
  query GetArticles {
    articles {
      id
      title
      content
      likes {
        id
      }
      comments {
        id
        content
      }
    }
  }
`;

const LIKE_ARTICLE = gql`
  mutation LikeArticle($articleId: Int!) {
    likeArticle(articleId: $articleId) {
      id
    }
  }
`;

interface Article {
  id: number;
  title: string;
  content: string;
  likes: { id: number }[];
  comments: { id: number; content: string }[];
}

export default defineComponent({
  setup() {
    const { result } = useQuery(GET_ARTICLES);
    const { mutate: likeArticle } = useMutation(LIKE_ARTICLE);

    const articles = ref<Article[]>([]);

    onMounted(async () => {
      const { data } = await result.value; // Obtenez directement les données ici
      articles.value = data.articles;
    });

    const handleLikeArticle = async (articleId: number) => {
      try {
        await likeArticle({ articleId }); // Passez l'objet avec 'articleId'
      } catch (error) {
        console.error('Error liking article:', error);
      }
    };

    return {
      articles,
      handleLikeArticle, // Utilisez une fonction séparée pour gérer l'aimer
    };
  },
});
</script>


<template>
  <div>
    <h1>Articles</h1>
    <div v-for="article in articles" :key="article.id">
      <h2>{{ article.title }}</h2>
      <p>{{ article.content }}</p>
      <button @click="handleLikeArticle(article.id)">Like</button>
      <p>Likes: {{ article.likes.length }}</p>
      <div>
        <h3>Comments</h3>
        <div v-for="comment in article.comments" :key="comment.id">
          <p>{{ comment.content }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

  
  