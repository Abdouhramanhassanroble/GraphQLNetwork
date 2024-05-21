<template>
  <div class="d-flex justify-content-center align-items-center vh-100">
    <form @submit.prevent="handleSubmit" class="w-50">
      <div class="form-group">
        <label for="email">email</label>
        <input
          id="email"
          v-model="email"
          type="text"
          class="form-control"
          required
          placeholder="Enter username"
        />
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input
          id="password"
          v-model="password"
          type="password"
          class="form-control"
          required
          placeholder="Enter password"
        />
      </div>
      <button type="submit" class="btn btn-primary btn-block">Login</button>
    </form>
  </div>
</template>

  
  <script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { useMutation } from '@vue/apollo-composable';
  import gql from 'graphql-tag';
  
  const LOGIN_USER = gql`
    mutation Login($email: String!, $password: String!) {
      login(email: $email, password: $password) {
        token
      }
    }
  `;
  
  export default defineComponent({
    setup() {
      const email = ref('');
      const password = ref('');
      const { mutate: login } = useMutation(LOGIN_USER);
  
      const handleSubmit = async () => {
        try {
          const result = await login({
              email: email.value,
              password: password.value,
            }
          );
          console.log('Token:', result?.data.login.token)
          // Sauvegarder le token dans le localStorage ou gérer l'état utilisateur
        } catch (error) {
          console.error(error);
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
  