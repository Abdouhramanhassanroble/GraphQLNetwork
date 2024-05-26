<template>
  <div class="container mt-5">
    <h2>Liste des Articles</h2>
    <ul v-if="loading">
      <li>Chargement...</li>
    </ul>
    <ul v-else>
      <li v-for="article in articles" :key="article.id" class="article-item">
        <router-link :to="`/article/${article.id}`">
          <div class="article-header">
            <h3>{{ article.title }}</h3>
            <p class="author">Par {{ article.author.email }}</p>
          </div>
          <p class="article-content">{{ article.content }}</p>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watchEffect } from 'vue';
import { useQuery } from '@vue/apollo-composable';
import { GET_ARTICLES } from '../graphql/queries';

interface Article {
  id: string;
  title: string;
  content: string;
  author: {
    email: string;
  };
}

export default defineComponent({
  name: 'ArticleList',
  setup() {
    const { result, loading, error } = useQuery(GET_ARTICLES);
    const articles = ref<Article[]>([]);

    // Utilisation de watchEffect pour mettre à jour les articles lorsque result change
    watchEffect(() => {
      if (result.value) {
        articles.value = result.value.articles;
      }
    });

    return {
      articles,
      loading,
      error,
    };
  },
});
</script>


<style scoped>
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f2f2f2; /* Couleur de fond douce */
}

.container {
  width: 100%;
  max-width: 1200px;
  margin: auto;
  padding: 20px;
  background-color: #ffffff; /* Fond blanc */
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); /* Ombre légère */
}

h2 {
  font-size: 24px;
  font-weight: bold;
  color: #333333; /* Couleur de titre */
  margin-bottom: 20px;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.article-item {
  background-color: #ffffff; /* Fond blanc */
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Ombre légère */
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.article-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1); /* Ombre légère au survol */
}

.article-item a {
  text-decoration: none;
  color: #333333; /* Couleur du texte */
}

.article-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.article-header h3 {
  margin: 0;
  font-size: 20px;
  color: #333333; /* Couleur du titre de l'article */
}

.author {
  font-size: 14px;
  color: #666666; /* Couleur de l'auteur */
}

.article-content {
  font-size: 16px;
  line-height: 1.6;
  color: #666666; /* Couleur du contenu de l'article */
}
</style>

