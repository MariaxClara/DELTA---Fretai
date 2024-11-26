import { createRouter, createWebHistory } from 'vue-router'
import Passageiro from '../views/Passageiro.vue'
import Motorista from '../views/Motorista.vue'
import CadastroMotorista from '../views/CadastroMotorista.vue'
import Index from '../views/Index.vue'
import Login from '../views/Login.vue'
import Motorista from '../views/Motorista.vue'
import MyRouters from '../views/MyRouters.vue'
import MyUsersPage from '../views/MyUsersPage.vue'
import PerfilMotorista from '../views/PerfilMotorista.vue'
import PerfilUsuario from '../views/PerfilUsuario.vue'
import RegisterUserDriver from '../views/RegisterUserDriver.vue'
import TrocaSenha from '../views/TrocaSenha.vue'


const routes = [
  {
    path: '/',
    name: 'Index',
    component: Index
  },
  {
    path: '/Passageiro',
    name: 'passageiro',
    component: Passageiro
  },
  {
    path: '/Motorista',
    name: 'motorista',
    component: Motorista
  },
  {
    path: '/CadastroMotorista',
    name: 'CadastroMotorista',
    component: CadastroMotorista
  },
  {
    path: '/Login',
    name: 'Login',
    component: Login
  }, 
  {
    path: '/MyRouter',
    name: 'MyRouter',
    component: MyRouters
  },
  {
    path: '/MyUsers',
    name: 'MyUsers',
    component: MyUsersPage
  },
  {
    path: '/PerfilMotorista',
    name: 'PerfilMotorista',
    component: PerfilMotorista
  },
  {
    path: '/PerfilUsuario',
    name: 'PerfilUsuario',
    component: PerfilUsuario
  },
  {
    path: '/RegisterUserDriver',
    name: 'RegisterUserDriver',
    component: RegisterUserDriver
  },
  {
    path: '/TrocaSenha',
    name: 'TrocaSenha',
    component: TrocaSenha
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router