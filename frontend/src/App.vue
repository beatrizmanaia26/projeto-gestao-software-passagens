<!--
define estrutura basica da aplicacao
 componente raiz da aplicação, contém o <router-view> (para exibir as views conforme a rota) e componentes comuns (navbar, footer..)
 -->
<template>
  <div id="app">
    <!-- O componente certo (Login, Home, Cadastro) aparecerá aqui-->
     -HORAS
    <router-view />
 <!-- é um espaço vazio reservado, funciona como uma "porta" (uso essa tag no template para chamar as rotas), serve como localizador, Vue Router olha para a URL do navegador, consulta as rotas que configurei e descobre qual componente deve ser mostrado, ele pega esse componente (Login.vue) e o coloca dentro da tag <router-view />. O conteúdo é atualizado automaticamente quando a URL muda, sem recarregar a página -->
  </div>
</template>

<script>
export default {
  name: 'App',
  components: {
    NavBar
  }
}
</script>

<style>
/* Estilos globais da aplicação podem vir aqui */
</style>
