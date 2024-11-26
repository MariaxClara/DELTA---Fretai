import { createRouter, createWebHistory } from 'vue-router'
import Passageiro from '../views/Passageiro.vue'

const routes = [
  {
    path: '/Passageiro',
    name: 'passageiro',
    component: Passageiro
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router