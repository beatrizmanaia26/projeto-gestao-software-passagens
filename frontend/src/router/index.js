//defino rotas para cada componente (tela) ex /cadastrar /logar e depois importo no MediaDeviceInfo.js
import { createRouter, createWebHistory } from 'vue-router'
import Landing from '../views/Landing.vue'
import Home from '../views/Home.vue'
import Login from '../views/Logar.vue'
import Cadastro from '../views/Cadastrar.vue'
import Carrinho from '../views/Carrinho.vue'
import UserMenu from '../components/usuario/UserMenu.vue'
import EscolhaPagamento from '../components/carrinho/EscolhaPagamento.vue'
import PassagensAereas from '../components/passagens/PassagensAereas.vue'
import PassagensMaritimas from '../components/passagens/PassagensMaritmicas.vue'
import SucessoPagamento from '../components/carrinho/SucessoPagamento.vue'
//só defini para esse pois os demais aparecerão entro de home
const routes = [
  { path: '/', component: Landing },
  { path: '/home', component: Home },
  { path: '/login', component: Login },
  { path: '/cadastro', component: Cadastro },
  { path: '/carrinho', component: Carrinho },
  { path: '/usuario', component: UserMenu },
  {path: '/aereas',component: PassagensAereas},
  {path: '/maritimas',component: PassagensMaritimas},
  {path: '/pagamento',component: EscolhaPagamento},
  {path: '/sucessoPagamento',component: SucessoPagamento},
]
const router = createRouter({
  history: createWebHistory(),
  routes
})
//createRouter é a função do Vue Router que cria o objeto de rotas.
//createWebHistory é o modo de histórico que usa URLs limpas

export default router
