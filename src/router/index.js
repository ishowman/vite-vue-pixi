import { createRouter, createWebHistory } from 'vue-router';
const Home = () => import('@/views/Home.vue');
const Game = () => import('@/views/Game.vue');

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
    },
    {
      path: '/game',
      component: Game,
      name: 'Game',
    },
  ],
});
export default router;
