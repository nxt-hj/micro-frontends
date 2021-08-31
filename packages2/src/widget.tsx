import moment from 'moment'
import React from 'react'
import ReactDOM from 'react-dom'
import singleSpaReact from 'single-spa-react'
// import { mountRootParcel } from 'single-spa'
import Parcel from 'single-spa-react/parcel'

declare var singleSpa: any
const Widget = function (props: object) {
    return <div>this is widget time: {moment().format('YYYY-MM-DD HH:mm:ss')}</div>
}

const WidgetLifeCycles = singleSpaReact({ React, ReactDOM, rootComponent: Widget })

export const bootstrap = WidgetLifeCycles.bootstrap
export const mount = function (props: any) {
    return WidgetLifeCycles.mount(props).then(() => {
        Promise.resolve()
    })
}
export const unmount = WidgetLifeCycles.unmount

export const remote = WidgetLifeCycles
// debugger
// export default () => <Parcel wrapWith='div' mountParcel={singleSpa.mountRootParcel} config={WidgetLifeCycles} />
