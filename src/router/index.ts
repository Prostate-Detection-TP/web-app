import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import DetectionVue from "@/detection/DetectionVue.vue";
import Register from "@/iam/Register.vue";
import Login from "@/iam/Login.vue";
import {useUserStore} from "@/stores/UserStore";
import Profile from "@/profile/Profile.vue";



const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/detect',
      name: 'detection',
      component: DetectionVue,
      meta: { requiresAuth: true, visible: true }
    },
    {
      path: '/profile',
      name: 'Profile',
      component: Profile,
      meta: { requiresAuth: true, visible: true }
    },
    {
      path: '/historic',
      name: 'Historic',
      component: () => import('../views/HistoricResults.vue'),
      meta: { requiresAuth: true, visible: true }
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    },
    {
    path: '/login',
      name: 'Login',
      component: Login
    }
  ]
})

router.beforeEach((to, from, next) => {
  const userStore = useUserStore();
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!userStore.loggedIn) {
      next({ name: 'Login' });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router
