<template>
    <div>
        
    </div>
</template>

<script lang="ts">
import {defineComponent, h, Component} from 'vue'

export default defineComponent({
    props:{
        options:[],
    },
    setup(props, {emit}) {
        console.log(props.options)
    },
})
</script>