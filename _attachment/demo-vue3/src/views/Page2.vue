<template>
    <h2>Ts Page2</h2>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    import store from '../store';
    export default defineComponent({
        name: 'page1',
        setup() {
            // 更新 visit 全局变量
            store.updateCnt();
        }
    })
</script>

<style scoped>
</style>
