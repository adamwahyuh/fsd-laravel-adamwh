import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth'; 

import HomeView from '../views/HomeView.vue';
import LoginView from '../views/LoginView.vue';
import AuthLayout from '@/views/Components/AuthLayout.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: AuthLayout,
      meta: { requiresAuth: true }, 
      children : [
        {
            path: '',
            name: 'home',
            component: HomeView,
        },
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { requiresGuest: true } 
    }
  ]
});

// Guard
router.beforeEach((to, from, next) => {
  const auth = useAuthStore();

  const isAuthRequired = to.matched.some(record => record.meta.requiresAuth);
  
  const isGuestOnly = to.matched.some(record => record.meta.requiresGuest);
  
  const isAuthenticated = !!auth.token;

  if (isAuthRequired && !isAuthenticated) {
    // Jika belum logged ke halaman login
    next('/login');
  } else if (isGuestOnly && isAuthenticated) {
    // Tidak bisa ke halaman login apabila sudah logged
    next('/');
  } else {
    next();
  }
});

export default router;