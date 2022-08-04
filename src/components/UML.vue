<template>
  <div class="big-contain">
    <n-config-provider  :theme="darkTheme">
      <div>
        <n-gradient-text type="info">
          Live Forever
        </n-gradient-text>
      </div>
    </n-config-provider>
  </div>
</template>

<script setup lang="ts">



</script>

<style scoped>
.big-contain{
  width:fit-content;
  margin:39px 43px 0 61px;
}

.n-gradient-text {
  font-size: 36px;
}
</style>