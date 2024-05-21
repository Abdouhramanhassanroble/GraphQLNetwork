import { createRouter, createWebHistory } from 'vue-router';
import Login from '../components/Login.vue';
import ArticlesList from '../components/ArticlesList.vue';
import Test from '../components/Test.vue';
import Register from '../components/Register.vue';

const routes = [
  { path: '/', component: Register },
  { path: '/articles', component: ArticlesList },
  { path: '/login', component: Login },
  { path: '/test', component: Test },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
