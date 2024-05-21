<template>
  <div class="container mt-5">
    <h2>Créer un Article</h2>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="title">Titre</label>
        <input
          id="title"
          v-model="title"
          type="text"
          class="form-control"
          required
          placeholder="Entrer le titre"
        />
      </div>
      <div class="form-group">
        <label for="content">Contenu</label>
        <textarea
          id="content"
          v-model="content"
          class="form-control"
          required
          placeholder="Entrer le contenu"
        ></textarea>
      </div>
      <button type="submit" class="btn btn-primary mt-3">Créer</button>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useMutation } from '@vue/apollo-composable';
import { CREATE_ARTICLE } from '../graphql/mutations';
import { useRouter } from 'vue-router';
import client from '../graphql/apolloClient.ts';

export default defineComponent({
  name: 'CreateArticle',
  setup() {
    const title = ref('');
    const content = ref('');
    const { mutate: createArticle } = useMutation(CREATE_ARTICLE, { client });
    const router = useRouter();

    const handleSubmit = async () => {
      try {
        const result = await createArticle({
            title: title.value,
            content: content.value,
        });
        console.log('Article créé:', result.data.createArticle);
        router.push('/articles');
      } catch (error) {
        console.error('Erreur lors de la création de l\'article:', error);
      }
    };

    return {
      title,
      content,
      handleSubmit,
    };
  },
});

</script>

<style scoped>
/* Ajoutez vos styles ici */
</style>
