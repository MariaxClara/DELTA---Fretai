<template>
    <div class="tela-inicial">
      <!-- Cabeçalho -->
      <header class="header">
        <img src="/images/iconeImage.png" alt="Logo" class="logo" />
        <h1>FretAí</h1>
      </header>
  
      <!-- Botões -->
      <div class="participantes">
        <button class="botao">
          <i class="icon-user"></i>
          <img src="/images/van.svg" alt="">
          Perfil
        </button>
        <button class="botao">
          <img src="/images/UserCircle.svg" alt="">
          <i class="icon-bus"></i>
          Motoristas
        </button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "Home",
  };
  </script>
  
  <style src="../assets/css/home.css">
</style>
  