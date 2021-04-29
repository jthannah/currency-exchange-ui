import { createWebHistory, createRouter } from "vue-router";
import Home from "/src/views/Home.vue";
import Share from "/src/views/Share.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/share",
    name: "Share",
    component: Share,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;