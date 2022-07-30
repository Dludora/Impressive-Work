<template>
  <n-space>
    <n-button @click="regisRouter">注册</n-button>
  </n-space>
</template>

<script>


export default {
  name: 'App',
  components: {

  },

  methods: {
    regisRouter () {
        this.$router.push('/regisTer')
      },
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
