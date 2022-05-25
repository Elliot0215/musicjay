<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'musicjay'
  }
</script>

<style>
  #app{
	background-image: url(assets/bg.png);
	background-size: contain;
  }
  body::-webkit-scrollbar {
	display: none;
  }
</style>
