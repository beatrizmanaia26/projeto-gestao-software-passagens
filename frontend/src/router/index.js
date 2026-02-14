//defino rotas para cada componente (tela) ex /cadastrar /logar e depois importo no MediaDeviceInfo.js
import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Logar.vue'
import Cadastro from '../views/Cadastrar.vue'
//só defini para esse pois os demais aparecerão entro de home 
const routes = [
  { path: '/', component: Home },
  { path: '/login', component: Login },
  { path: '/cadastro', component: Cadastro }
]
const router = createRouter({
  history: createWebHistory(),
  routes
})
//createRouter é a função do Vue Router que cria o objeto de rotas.
//createWebHistory é o modo de histórico que usa URLs limpas 

export default router