<template>
  <nav class="navbar navbar-dark bg-dark">
    <div class="container-fluid">
      <!-- Marque et bouton pour afficher/cacher le menu sur les petits écrans -->
      <a class="navbar-brand" href="#">Mon Application fdsfds</a>
      <li>
        <router-link to="/articles" >Articles</router-link>
      </li>
    </div>
  </nav>
</template>


<script lang="ts">
import { RouterLink } from 'vue-router';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Navbar',
});
</script>