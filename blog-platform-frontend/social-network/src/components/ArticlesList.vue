<template>
  <div class="container mt-5">
    <h2>Liste des Articles</h2>
    <ul v-if="loading">
      <li>Chargement...</li>
    </ul>
    <ul v-else>
      <li v-for="article in articles" :key="article.id">
        <h3>{{ article.title }}</h3>
        <p>{{ article.content }}</p>
        <p><strong>Auteur:</strong> {{ article.author.email }}</p>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useQuery } from '@vue/apollo-composable';
import { GET_ARTICLES } from '../graphql/queries';

export default defineComponent({
  name: 'ArticleList',
  setup() {
    const { result, loading, error } = useQuery(GET_ARTICLES);
    const articles = ref([]);

    if (result.value) {
      articles.value = result.value.articles;
    }

    return {
      articles,
      loading,
      error,
    };
  },
});
</script>

<style scoped>
/* Ajoutez vos styles ici */
</style>
