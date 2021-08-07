import Vue from 'vue';
import VueRouter from 'vue-router';
// import Home from '../views/Home.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    // component: () => import('../components/Game/Game.vue'), // WARNING: Only for testing. Change back to Home later.
  },
  {
    path: '/:roomId',
    name: 'Room',
    component: () => import('../views/Room.vue'),
  },
  {
    path: '*',
    redirect: { name: 'Home' }, // Return to Home if URL is not defined. 'Catch all' route.
  },
];

const router = new VueRouter({
  routes,
});

export default router;
