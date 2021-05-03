import { createRouter, createWebHistory } from 'vue-router'
import Home from '/src/views/home.vue'
import SavedConversions from '/src/views/saved-conversions.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/saved',
    name: 'SavedConversions',
    component: SavedConversions,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
