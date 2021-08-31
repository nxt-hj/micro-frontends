// import { registerApplication, start } from 'single-spa'
import('./App')

declare var singleSpa: any

// singleSpa.registerApplication(
//     'widget',
//     () => import('../../packages2/src/widget'),
//     (location: Location) => location.pathname.startsWith('/'),
//     { a: 1 }
// )

singleSpa.start()

//@ts-ignore
if (module.hot) {
    //@ts-ignore
    module.hot.accept()
}