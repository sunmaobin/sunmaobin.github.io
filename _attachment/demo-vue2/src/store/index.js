import {reactive, readonly } from 'vue';

let store = reactive({
    message: 'Hello Vue3!',
    count: 1
});

export default {
    getState() {
        return readonly(store);
    },
    updateCnt() {
        console.log('updateCnt', store.count);
        store.count++;
    }
}
