<template>
  <div class="d-flex justify-content-center align-items-center vh-100">
    <form @submit.prevent="handleSubmit" class="w-50">
      <div class="form-group">
        <label for="email">Email</label>
        <input
          id="email"
          v-model="email"
          type="email"
          class="form-control"
          required
          placeholder="Enter email"
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
import { useRouter } from 'vue-router'; // Importer useRouter pour rediriger l'utilisateur

const LOGIN_USER = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password)
  }
`;

export default defineComponent({
  setup() {
    const email = ref('');
    const password = ref('');
    const router = useRouter(); // Initialiser le routeur
    const { mutate: login } = useMutation(LOGIN_USER);

    const handleSubmit = async () => {
      try {
        const result = await login({
          email: email.value,
          password: password.value,
        });
        const token = result?.data?.login;
        console.log('Token:', token);
        console.log('Vous êtes connecté');
        
        // Sauvegarder le token dans le localStorage
        localStorage.setItem('token', token);

        // Rediriger vers /articles
        router.push('/articles');
      } catch (error) {
        console.error('Erreur lors de la connexion:', error);
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
