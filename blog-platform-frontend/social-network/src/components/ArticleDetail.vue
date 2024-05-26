<template>
  <div class="full-page-container">
    <div class="article-container">
      <div v-if="loading" class="loading">Loading...</div>
      <div v-else-if="error" class="error">{{ error.message }}</div>
      <div v-else-if="article" class="article">
        <h1 class="article-title">{{ article.title }}</h1>
        <p class="article-content">{{ article.content }}</p>
        <p class="article-author"><strong>Author:</strong> {{ article.author.email }}</p>

        <h2>Commentaires</h2>
        <ul class="comments-list">
          <li v-for="comment in article.comments" :key="comment.id" class="comment">
            <p class="comment-content">{{ comment.content }}</p>
            <p class="comment-author"><strong>Auteur:</strong> {{ comment.author.email }}</p>
            <template v-if="isLoggedIn">
              <button @click="deleteComment(comment.id)" class="delete-button">Supprimer</button>
            </template>
          </li>
        </ul>

        <h2>Likes</h2>
        <p class="likes-count">{{ article.likes.length }}</p>
      
        <template v-if="isLoggedIn">
          <h2>Ajouter un commentaire</h2>
          <form @submit.prevent="submitComment" class="comment-form">
            <div>
              <label for="comment-content">Comment:</label>
              <textarea v-model="content" id="comment-content" required></textarea>
            </div>
            <button type="submit" class="submit-button">Ajouter un commentaire</button>
          </form>
          <button @click="toggleLike" class="like-button">
            {{ isLiked ? 'Unlike' : 'Like' }}
          </button>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watchEffect } from 'vue';
import { useRouter} from 'vue-router';
import { useQuery, useMutation } from '@vue/apollo-composable';
import { GET_ARTICLE_DETAILS } from '../graphql/queries';
import { CREATE_COMMENT, DELETE_COMMENT, LIKE_ARTICLE, UNLIKE_ARTICLE } from '../graphql/mutations';

export default {
  props: {
    id: {
      type: [Number, String],
      required: true
    }
  },
  setup(props) {
    const articleId = Number(props.id);
    const { result, loading, error } = useQuery(GET_ARTICLE_DETAILS, { id: articleId });
    const isLiked = ref(false);
    const article = ref(null);
    const content = ref('');
    const router = useRouter();
    const isLoggedIn = localStorage.getItem('token') !== null;


    const { mutate: createComment, onDone: onCommentCreated, onError: onCommentCreationError } = useMutation(CREATE_COMMENT);
    const { mutate: deleteCommentMutation, onDone: onCommentDeleted, onError: onCommentDeletionError } = useMutation(DELETE_COMMENT);
    const { mutate: likeArticleMutation } = useMutation(LIKE_ARTICLE);
    const { mutate: unlikeArticleMutation } = useMutation(UNLIKE_ARTICLE);

    onCommentCreated(({ data }) => {
      const newComment = data.createComment;
      article.value.comments = [...article.value.comments, newComment];
      content.value = ''; // Clear the textarea
    });

    onCommentCreationError((error) => {
      console.error('Error creating comment:', error);
    });

    const submitComment = () => {
      createComment({ content: content.value, articleId: articleId });
      location.reload();
    };

    onCommentDeleted(({ data }) => {
      if (data && data.deleteComment) {
        const deletedCommentId = data.deleteComment.id;
        article.value.comments = article.value.comments.filter(comment => comment.id !== deletedCommentId);
        
      } else {
        console.error('No comment data returned on deletion.');
      }
    });

    onCommentDeletionError((error) => {
      console.error('Error deleting comment:', error);
    });

    const deleteComment = (commentId) => {
      deleteCommentMutation({ id: commentId });
      location.reload();
    };

    const toggleLike = () => {
      if (isLiked.value) {
        unlikeArticleMutation({ articleId })
          .then(() => {
            isLiked.value = false;
            article.value.likes = article.value.likes.filter(like => like.token !== getToken());
            
          })
          .catch(error => {
            console.error('Error unliking article:', error);
          });
          location.reload();
      } else {
        likeArticleMutation({ articleId })
          .then(() => {
            isLiked.value = true;
            article.value.likes.push({ token: getToken() });
            
          })
          .catch(error => {
            console.error('Error liking article:', error);
          });
          location.reload();
      }
    };

    watchEffect(() => {
      if (result.value) {
        article.value = result.value.article;
        isLiked.value = article.value.likes.some(like => like.token === getToken());
      }
    });

    watchEffect(() => {
      if (error.value) {
        console.error('GraphQL Error:', error.value);
      }
    });

    // Function to get the current token
    function getToken() {
      return localStorage.getItem('token');
    }

    return {
      article,
      loading,
      error,
      content,
      submitComment,
      deleteComment,
      isLiked,
      toggleLike,
      isLoggedIn
    };
  }
};
</script>


<style scoped>
body {
  margin: 0;
  font-family: 'Roboto', sans-serif;
  background-color: #0d0d0d;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.full-page-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
}

.article-container {
  max-width: 800px;
  width: 100%;
  background-color: #1e1e1e;
  color: #ffffff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.2);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.article-container:hover {
  box-shadow: 0 0 40px rgba(0, 255, 255, 0.5);
}

.loading, .error {
  text-align: center;
  font-size: 1.5em;
  color: #ff4444;
}

.article-title {
  font-size: 2.5em;
  color: #00ffff;
  text-shadow: 0 0 10px #00ffff, 0 0 20px #00ffff;
  text-align: center;
  margin-bottom: 20px;
}

.article-content {
  font-size: 1.2em;
  line-height: 1.6;
  text-align: center;
  margin-bottom: 20px;
}

.article-author {
  font-size: 1em;
  margin-top: 10px;
  text-align: center;
}

.comments-list {
  list-style: none;
  padding: 0;
  width: 100%;
  margin: 20px 0;
}

.comment {
  background-color: #2a2a2a;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.1);
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.comment:hover {
  transform: scale(1.05);
}

.comment-content {
  font-size: 1.1em;
  text-align: center;
  margin-bottom: 5px;
}

.comment-author {
  font-size: 0.9em;
  color: #00ff00;
  text-align: center;
}

.delete-button {
  background-color: #ff4444;
  color: #ffffff;
  border: none;
  padding: 5px 10px;
  margin-top: 10px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.delete-button:hover {
  background-color: #ff0000;
}

.likes-count {
  font-size: 1.2em;
  color: #00ff00;
  text-shadow: 0 0 10px #00ff00;
  text-align: center;
}

.comment-form {
  margin-top: 20px;
  width: 100%;
}

.comment-form textarea {
  width: 100%;
  padding: 10px;
  background-color: #1e1e1e;
  color: #ffffff;
  border: 1px solid #00ffff;
  border-radius: 5px;
  transition: border-color 0.3s ease;
}

.comment-form textarea:focus {
  border-color: #00ffcc;
}

.comment-form button {
  background-color: #00ff00;
  color: #1e1e1e;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  width: 100%;
  margin-top: 10px;
}

.comment-form button:hover {
  background-color: #00cc00;
}

.like-button {
  background-color: #00ffff;
  color: #1e1e1e;
  border: none;
  padding: 10px 20px;
  margin-top: 20px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  width: 100%;
}

.like-button:hover {
  background-color: #00cccc;
}
</style>
