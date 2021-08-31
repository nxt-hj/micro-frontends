<template>
    <Parcel
        v-on:parcelMounted="parcelMounted()"
        v-on:parcelUpdated="parcelUpdated()"
        :config="parcelConfig"
        :mountParcel="mountParcel"
        :wrapWith="wrapWith"
        :wrapClass="wrapClass"
        :wrapStyle="wrapStyle"
        :parcelProps="getParcelProps()"
    />
</template>

<script lang="ts">
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
                // single-spa props are available on the "this" object. Forward them to your component as needed.
                // https://single-spa.js.org/docs/building-applications#lifecyle-props
            })
        },
    },
})

export const bootstrap = vueLifecycles.bootstrap
export const mount = vueLifecycles.mount
export const unmount = vueLifecycles.unmount
export default {
    components: {
        Parcel,
    },
    data() {
        return {
            parcelConfig: vueLifecycles,

            /*
        mountParcel (function, required)

        The mountParcel function can be either the current Vue application's mountParcel prop or
        the globally available mountRootParcel function. More info at
        http://localhost:3000/docs/parcels-api#mountparcel
      */
            mountParcel: singleSpa.mountRootParcel,

            /*
        wrapWith (string, optional)

        The wrapWith string determines what kind of dom element will be provided to the parcel.
        Defaults to 'div'
      */
            wrapWith: 'div',

            /*
        wrapClass (string, optional)

        The wrapClass string is applied to as the CSS class for the dom element that is provided to the parcel
      */
            wrapClass: 'bg-red',

            /*
        wrapStyle (object, optional)

        The wrapStyle object is applied to the dom element container for the parcel as CSS styles
      */
            wrapStyle: {
                outline: '1px solid red',
            },
        }
    },
    methods: {
        // These are the props passed into the parcel
        getParcelProps() {
            return {
                text: `Hello world`,
            }
        },
        // Parcels mount asynchronously, so this will be called once the parcel finishes mounting
        parcelMounted() {
            console.log('parcel mounted')
        },
        parcelUpdated() {
            console.log('parcel updated')
        },
    },
}
</script>
