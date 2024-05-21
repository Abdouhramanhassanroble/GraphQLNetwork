<template>
    <div class="container mt-5">
      <h2>Liste des Utilisateurs</h2>
      <ul v-if="loading">
        <li>Chargement...</li>
      </ul>
      <ul v-else>
        <li v-for="user in users" :key="user.id">
          <p><strong>Email:</strong> {{ user.email }}</p>
          <p><strong>Articles:</strong></p>
          <ul>
            <li v-for="article in user.articles" :key="article.id">
              {{ article.title }}
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { useQuery } from '@vue/apollo-composable';
  import { GET_USERS } from '../graphql/queries';
  
  export default defineComponent({
    name: 'UserList',
    setup() {
      const { result, loading, error } = useQuery(GET_USERS);
      const users = ref([]);
  
      if (result.value) {
        users.value = result.value.users;
      }
  
      return {
        users,
        loading,
        error,
      };
    },
  });
  </script>
  
  <style scoped>
  /* Ajoutez vos styles ici */
  </style>
  