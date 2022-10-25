import { createRouter, createWebHistory } from 'vue-router';
const Home = () => import('@/views/Home.vue');
const Game = () => import('@/views/Game.vue');
const Prize = () => import('@/views/Prize.vue');
const Rule = () => import('@/views/Rule.vue');
const Poster = () => import('@/views/Poster.vue');
const SelectTeam = () => import('@/views/SelectTeam.vue');

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
    },
    {
      path: '/select',
      name: 'SelectTeam',
      component: SelectTeam,
    },
    {
      path: '/game',
      component: Game,
      name: 'Game',
    },
    {
      path: '/prize',
      component: Prize,
      name: 'Prize',
    },
    {
      path: '/rule',
      component: Rule,
      name: 'Rule',
    },
    {
      path: '/poster',
      component: Poster,
      name: 'Poster',
    },
    {
      path: '/:catchAll(.*)',
      redirect: '/',
    },
  ],
});
export default router;
