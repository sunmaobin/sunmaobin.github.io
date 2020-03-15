<template>
    <h1>{{ message }}</h1>
    <p>Ts count：{{count}}</p>

    <router-link to="/">Home</router-link>
    <router-link to="/page1">Page1</router-link>
    <router-link to="/page2">Page2</router-link>

    <router-view></router-view>
</template>

<script lang="ts">
    import { defineComponent, toRefs } from 'vue'
    import store from './store';

    export default defineComponent({
        setup() {
            let data = store.getState();

            // WARNING：这里无法直接修改属性 readonly
            // data.count++;

            return {
                ...toRefs(data)
            }
        }
    })
</script>

<style scoped>
    h1 {
        font-family: Arial, Helvetica, sans-serif;
    }
    a + a {
        margin-left: 10px;
    }
</style>
