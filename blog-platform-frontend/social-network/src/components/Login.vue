<template>
  <div class="d-flex justify-content-center align-items-center vh-100">
    <form @submit.prevent="handleLogin" class="w-50">
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

const LOGIN_USER = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password)
  }
`;

export default defineComponent({
  setup() {
    const email = ref('');
    const password = ref('');
    const { mutate: login } = useMutation(LOGIN_USER);

      const handleLogin = async () => {
    try {
      const result = await login({
          email: email.value,
          password: password.value,
      });
      const token = result.data.login;
      localStorage.setItem('token', token);
      location.href = '/';
    } catch (error) {
      console.error('Login error:', error);
    }
  };


    return {
      email,
      password,
      handleLogin,
    };
  },
});
</script>
