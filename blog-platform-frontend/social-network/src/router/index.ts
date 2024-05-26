import { createRouter, createWebHistory } from 'vue-router';
import Login from '../components/Login.vue';
import ArticlesList from '../components/ArticlesList.vue';
import MesArticles from '../components/MesArticles.vue';
import Register from '../components/Register.vue';
import CreateArticles from '../components/CreateArticles.vue';
import ArticleDetail from '../components/ArticleDetail.vue';

const routes = [
  { path: '/', component: ArticlesList },
  { path: '/creation_articles', component: CreateArticles},
  { path: '/inscription', component: Register },
  { path: '/connexion', component: Login },
  { path: '/article/:id', component: ArticleDetail, props: true},
  { path: '/MesArticles', component: MesArticles },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
