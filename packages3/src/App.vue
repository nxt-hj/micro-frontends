<template>
    <div>
        <h3>this is vue app</h3>
        这是传参{{ reactProps }}____{{ now }}
        <Content />
        <Button />
    </div>
</template>

<script lang="ts">
import { ref, defineAsyncComponent } from 'vue'
import moment from 'moment'
export default {
    data() {
        return { now: moment().format('YYYY-MM-DD HH:mm:ss') }
    },
    components: {
        Content: defineAsyncComponent(() => import('./components/Content.vue')),
        Button: defineAsyncComponent(() => import('./components/Button')),
    },
    setup() {
        const count = ref(0)
        const inc = () => {
            count.value++
        }
        return {
            count,
            inc,
        }
    },
    props: {
        reactProps: {},
    },
}
</script>
