<template>
  <v-ditor id="docu-card"></v-ditor>
</template>

<script setup>
import VDitor from "@/components/Document/vDitor";


</script>

<style scoped>
#docu-card {
  position: absolute;
  width: 800px;
  height: 550px;
  left: calc(50% - 600px / 2);
  top: calc(50% - 500px / 2);

  background: #F5F5DC;
  box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.25);
}
</style>