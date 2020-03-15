<template>
    <h2>Page2</h2>
</template>

<script>
    import store from '../store';
    export default {
        name: 'page1',
        setup() {
            // 更新 visit 全局变量
            store.updateCnt();
        }
    }
</script>

<style scoped>
</style>
