import { createRouter, createWebHistory } from 'vue-router'
import Passageiro from '../views/Passageiro.vue'
import Motorista from '../views/Motorista.vue'

const routes = [
  {
    path: '/Passageiro',
    name: 'passageiro',
    component: Passageiro
  },
  {
    path: '/Motorista',
    name: 'motorista',
    component: Motorista
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router