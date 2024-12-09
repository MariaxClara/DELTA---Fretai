import { createRouter, createWebHistory } from 'vue-router'
import Passageiro from '../views/Passageiro.vue'
import Motorista from '../views/Motorista.vue'
import CadastroMotorista from '../views/CadastroMotorista.vue'
import Index from '../views/index.vue'
import Login from '../views/login.vue'
import MyRouters from '../views/MyRouters.vue'
import MyUsers from '../views/MyUsers.vue'
import PerfilMotorista from '../views/PerfilMotorista.vue'
import PerfilUsuario from '../views/perfilUsuario.vue'
import RegisterUserDriver from '../views/registerUserDriver.vue'
import TrocaSenha from '../views/trocaSenha.vue'
import Chat from '../views/Chat.vue'
import Corridas from '../views/Corridas.vue'


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
    component: MyUsers
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
  },
  {
    path: '/Chat',
    name: 'Chat',
    component: Chat
  },
  {
    path: '/Corridas',
    name: 'Corridas',
    component: Corridas
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router