<template>
    <div>
      <Navbar v-if="showNavbar" />
      <main>
        <router-view />
      </main>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, computed } from 'vue';
  import { useRoute } from 'vue-router';
  import NavBar from './NavBar.vue';
  
  export default defineComponent({
    name: 'AppLayout',
    components: {
    NavBar,
    },
    setup() {
      const route = useRoute();
      const showNavbar = computed(() => route.path !== '/login');
      
      return {
        showNavbar,
      };
    },
  });
  </script>
  