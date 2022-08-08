<template>
    <div class="out">
        <div class="head">
            <teamHead></teamHead>
        </div>
        <div class="info">

            <projectList></projectList>

        </div>
    </div>
</template>

<script setup lang="ts">
import projectList from './ChooseList.vue'
import teamHead from './ChooseHead.vue'

</script>

<style scoped>
.out{
    height: 100%;
}
.head{
margin: auto;
    margin-top: 80px;
    padding-bottom: 50px;
    width: 70%;
    border-bottom: 1px solid #414958;
}
.info{
    height: 500px;
    width: 90%;
    margin:auto;
    margin-top: 30px;
}
</style>