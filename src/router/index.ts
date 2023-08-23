import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import DetectionVue from "@/detection/DetectionVue.vue";
import Register from "@/iam/Register.vue";
import Login from "@/iam/Login.vue";

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
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: DetectionVue
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    },{
    path: '/login',
      name: 'Login',
      component: Login
    }
  ]
})

export default router