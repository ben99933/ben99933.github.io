import { createRouter, createWebHistory,createWebHashHistory } from 'vue-router'
// import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    // redirect / to /blog
    {
      path: "/",
      redirect: "/blog/home"
    },
    {
      path: '/blog/:page?',
      name: 'Blog',
      component: () => import('../views/BlogListView.vue')
    },
    {
      path: '/about/:page?',
      name: 'about',
      component: () => import('../views/AboutView.vue')
    },
  ]
})

export default router
