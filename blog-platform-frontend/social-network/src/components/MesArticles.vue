<template>
  <div class="container mt-5">
    <h1 class="text-center mb-4">Mes Articles</h1>
    <div v-if="loading" class="text-center">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Chargement...</span>
      </div>
    </div>
    <div v-else>
      <div v-if="articles.length === 0" class="alert alert-info text-center">
        Vous n'avez pas encore créé d'articles.
      </div>
      <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4" v-else>
        <div v-for="article in articles" :key="article.id" class="col">
          <div class="card h-100 futuristic-card">
            <router-link :to="`/article/${article.id}`">
              <!-- Remplacez le contenu de la carte par les détails de votre article -->
              <div class="card-body">
                <h5 class="card-title">{{ article.title }}</h5>
                <p class="card-text">{{ article.content }}</p>
              </div>
            </router-link>
            <div class="card-footer futuristic-footer">
              <button @click="deleteArticle(article.id)" class="btn btn-danger w-100 futuristic-button">
                <i class="fas fa-trash-alt"></i> Supprimer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watchEffect } from 'vue';
import { useRouter } from 'vue-router';
import { useQuery, useMutation } from '@vue/apollo-composable';
import { GET_MY_ARTICLES } from '../graphql/queries'; // Assurez-vous d'avoir importé la bonne requête
import { DELETE_ARTICLE } from '../graphql/mutations'; // Assurez-vous d'avoir importé la bonne mutation


export default defineComponent({
  setup() {
    const { loading, result, refetch } = useQuery(GET_MY_ARTICLES);
    const articles = ref([]);
    const router = useRouter();
    const isLoggedIn = localStorage.getItem('token') !== null;

    if (!isLoggedIn) {
      // Rediriger l'utilisateur vers la page de connexion s'il n'est pas connecté
      router.push('/');
    }


    watchEffect(() => {
      if (result.value) {
        articles.value = result.value.myArticles;
      }
    });

    const { mutate: deleteArticleMutation } = useMutation(DELETE_ARTICLE);

    const deleteArticle = async (id: number) => {
      try {
        await deleteArticleMutation({ id });
        location.reload(); // Recharge la page pour afficher les changements
      } catch (error) {
        console.error('Erreur lors de la suppression de l\'article:', error);
      }
    };

    return {
      loading,
      articles,
      deleteArticle,
      refetch,
    };
  },
});
</script>

<style scoped>
.card {
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.2);
  transition: box-shadow 0.3s ease-in-out;
}

.card:hover {
  box-shadow: 0 0 40px rgba(255, 255, 255, 0.6);
}

.futuristic-card {
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.futuristic-footer {
  background-color: rgba(255, 255, 255, 0.1);
  border-top: 1px solid rgba(255, 255, 255, 0.3);
}

.futuristic-button {
  background-color: rgba(255, 0, 0, 0.8);
  color: white;
  border: none;
  transition: background-color 0.3s ease-in-out;
}

.futuristic-button:hover {
  background-color: rgba(255, 0, 0, 1);
}
</style>
