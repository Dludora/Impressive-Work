<template>
  <n-space>
    <n-button @click="regisRouter">注册</n-button>
  </n-space>
</template>

<script>


export default {
  name: 'homePage',
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

</style>
