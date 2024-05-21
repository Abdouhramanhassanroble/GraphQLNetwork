<template>
    <div class="container mt-5">
      <h2>Mes Articles</h2>
      <ul v-if="loading">
        <li>Chargement...</li>
      </ul>
      <ul v-else>
        <li v-for="article in articles" :key="article.id">
          <h3>{{ article.title }}</h3>
          <p>{{ article.content }}</p>
          <p><strong>Auteur:</strong> {{ article.author.email }}</p>
          <button @click="deleteArticle(article.id)" class="btn btn-danger">Supprimer</button>
        </li>
      </ul>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { useQuery, useMutation } from '@vue/apollo-composable';
  import { GET_MY_ARTICLES } from '../graphql/queries';
  import { DELETE_ARTICLE } from '../graphql/mutations';
  
  export default defineComponent({
    name: 'MyArticles',
    setup() {
      const { result, loading, error, refetch } = useQuery(GET_MY_ARTICLES);
      const articles = ref([]);
  
      if (result.value) {
        articles.value = result.value.myArticles;
      }
  
      const { mutate: deleteArticleMutation } = useMutation(DELETE_ARTICLE);
  
      const deleteArticle = async (id: number) => {
        try {
          await deleteArticleMutation({
             id ,
          });
          await refetch(); // Refetch the articles after deletion
          console.log('Article supprimé:', id);
        } catch (error) {
          console.error('Erreur lors de la suppression de l\'article:', error);
        }
      };
  
      return {
        articles,
        loading,
        error,
        deleteArticle,
      };
    },
  });
  </script>
  
  <style scoped>
  /* Ajoutez vos styles ici */
  </style>
  