<template>
  <nav class="navbar navbar-dark bg-dark">
    <div class="container-fluid">
      <!-- Marque et bouton pour afficher/cacher le menu sur les petits écrans -->
      <router-link class="navbar-brand" to="/">Mon Application</router-link>

      <!-- Afficher différents liens en fonction de la présence du token -->
      <template v-if="isLoggedIn">
        <router-link to="/">Tous les articles</router-link>
        <router-link to="/MesArticles">Mes articles</router-link>
        <router-link to="/liste_utilisateurs">Utilisateurs</router-link>
        <router-link to="/creation_articles">Créer des articles</router-link>
        <router-link @click="logout" to="/">Déconnexion</router-link>
      </template>
      <template v-else>
        <router-link to="/connexion">Connexion</router-link>
        <router-link to="/inscription">Inscription</router-link>
      </template>
    </div>
  </nav>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'Navbar',
  setup() {
    
    const router = useRouter();
    const isLoggedIn = localStorage.getItem('token') !== null; // Vérifie si le token est présent dans le localStorage

    const logout = () => {
      localStorage.removeItem('token');
      window.location.reload()
      // Supprime le token du localStorage
      router.push('/login'); // Redirige vers la page de connexion
    };

    return {
      isLoggedIn,
      logout,
    };
  },
});
</script>
