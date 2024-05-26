<template>
  <nav class="navbar navbar-dark bg-dark">
    <div class="container-fluid">
      <!-- Marque et bouton pour afficher/cacher le menu sur les petits écrans -->
      <router-link class="navbar-brand" to="/">
        <img src="https://1000logos.net/wp-content/uploads/2022/01/2K-Logo-2005.png" alt="logo" width="100" height="30" class="d-inline-block align-text-top">
      </router-link>

      <!-- Afficher différents liens en fonction de la présence du token -->
      <div class="d-flex align-items-center ml-auto">
        <template v-if="isLoggedIn">
          <router-link class="nav-link" to="/">Tous les articles</router-link>
          <div class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              Articles
            </a>
            <div class="dropdown-menu" aria-labelledby="navbarDropdown">
              <router-link class="dropdown-item" to="/MesArticles">Mes articles</router-link>
              <router-link class="dropdown-item" to="/creation_articles">Créer un article</router-link>
            </div>
          </div>
          <router-link class="nav-link" @click="logout" to="/">Déconnexion</router-link>
        </template>
        <template v-else>
          <router-link class="btn btn-primary ml-2" to="/connexion">Connexion</router-link>
          <router-link class="btn btn-secondary ml-2" to="/inscription">Inscription</router-link>
        </template>
      </div>
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
