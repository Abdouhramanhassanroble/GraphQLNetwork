<template>
  <div class="form-container">
    <h1>Inscription</h1>
    <form @submit.prevent="handleSubmit" class="signup-form">
      <div class="form-group">
        <label for="email">Email:</label>
        <input id="email" v-model="email" type="email" required />
      </div>
      <div class="form-group">
        <label for="password">Mot de passe:</label>
        <input id="password" v-model="password" type="password" required />
      </div>
      <button type="submit" class="submit-button">S'inscrire</button>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRouter} from 'vue-router';
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
    const router = useRouter();

    const { mutate: createUser } = useMutation(CREATE_USER);

    const handleSubmit = async () => {
      try {
        const result = await createUser({
            email: email.value,
            password: password.value,
          }

        );
        router.push('/connexion');
        console.log('Utilisateur créé:', result?.data.createUser);
      } catch (error) {
        console.error('Erreur lors de l\'inscription:', error);
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
body {
  margin: 0;
  font-family: 'Roboto', sans-serif;



  height: 100vh;
  background: linear-gradient(to right, #1f4037, #99f2c8);
}


.form-container {
  margin: 0 auto;
  margin-top: 50px;
  background-color: #ffffff;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 400px;
  width: 100%;
  animation: fadeIn 1s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

h1 {
  margin-bottom: 20px;
  color: #333333;
  font-size: 2em;
}

.signup-form {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.form-group {
  margin-bottom: 20px;
  width: 100%;
  text-align: left;
}

label {
  display: block;
  margin-bottom: 5px;
  color: #666666;
  font-weight: bold;
}

input {
  width: 100%;
  padding: 12px;
  border: 1px solid #dddddd;
  border-radius: 8px;
  box-sizing: border-box;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

input:focus {
  border-color: #007bff;
  box-shadow: 0 0 8px rgba(0, 123, 255, 0.2);
  outline: none;
}

.submit-button {
  padding: 12px 20px;
  background-color: #007bff;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
  width: 100%;
}

.submit-button:hover {
  background-color: #0056b3;
  transform: translateY(-2px);
}

.submit-button:active {
  background-color: #004494;
  transform: translateY(0);
}
</style>
