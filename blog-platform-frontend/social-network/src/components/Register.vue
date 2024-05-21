<template>
    <div>
      <h1>Inscription</h1>
      <form @submit.prevent="handleSubmit">
        <div>
          <label for="email">Email:</label>
          <input id="email" v-model="email" type="email" required />
        </div>
        <div>
          <label for="password">Mot de passe:</label>
          <input id="password" v-model="password" type="password" required />
        </div>
        <button type="submit">S'inscrire</button>
      </form>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { useMutation } from '@vue/apollo-composable';
  import gql from 'graphql-tag';
  
  const CREATE_USER = gql`
    mutation CreateUser($email: String!, $password: String!) {
      createUser(email: $email, password: $password) {
        id
        email
      }
    }
  `;
  
  export default defineComponent({
    name: 'Signup',
    setup() {
      const email = ref('');
      const password = ref('');

      const { mutate: createUser } = useMutation(CREATE_USER);
  
      const handleSubmit = async () => {
        try {
          const result = await createUser({
              email: email.value,
              password: password.value,
            }
          );
          console.log('Utilisateur créé:', result?.data.createUser);
          // Rediriger vers une autre page ou afficher un message de succès
        } catch (error) {
          console.error('Erreur lors de l\'inscription:', error);
          // Afficher un message d'erreur à l'utilisateur
        }
      };
  
      return {
        email,
        password,
        handleSubmit,
      };
    },
  });
  </script>
  
  <style scoped>
  /* Styles spécifiques à cette composante */
  </style>
  