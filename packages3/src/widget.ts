declare var singleSpa: any

// For new versions of webpack
//@ts-ignore
import Parcel from 'single-spa-vue/parcel'

// import { mountRootParcel } from 'single-spa'
import { h, createApp } from 'vue'
import singleSpaVue from 'single-spa-vue'
import App from './App.vue'

const vueLifecycles = singleSpaVue({
    createApp,
    appOptions: {
        render() {
            return h(App, {
                //@ts-ignore
                reactProps:this.reactProps,
                // single-spa props are available on the "this" object. Forward them to your component as needed.
                // https://single-spa.js.org/docs/building-applications#lifecyle-props
            })
        },
    },
})

// export const bootstrap = vueLifecycles.bootstrap
// export const mount = vueLifecycles.mount
// export const unmount = vueLifecycles.unmount
export const remote = vueLifecycles
