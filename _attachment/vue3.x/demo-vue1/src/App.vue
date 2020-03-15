<template>
    <h1>Hello Vue 3!</h1>
    <button @click="inc">Clicked {{ count }} times.</button>
</template>

<script>
    import { ref } from 'vue'

    export default {
        setup() {
            const count = ref(0)
            const inc = () => {
                count.value++
            }

            return {
                count,
                inc
            }
        }
    }
</script>

<style scoped>
    h1 {
        font-family: Arial, Helvetica, sans-serif;
    }
</style>
