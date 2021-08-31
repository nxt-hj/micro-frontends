import React from 'react'
import Parcel from 'single-spa-react/parcel'
const reducer = function (state: object, action: { type: string }) {
    if (action.type === 'load success') {
        return { ...state, failed: false, ready: true }
    }
    return { ...state, failed: true, ready: false }
}
export function useDynamicScript({ url }: RemoteInfo) {
    const [remoteState, dispatch] = React.useReducer(reducer, { failed: false, ready: false })
    React.useEffect(() => {
        const script = document.createElement('script')
        script.src = url
        script.text = 'text/javascript'
        // script.async = true
        script.onload = () => {
            dispatch({ type: 'load success' })
            document.head.removeChild(script)
        }
        script.onerror = () => {
            dispatch({ type: 'load error' })
        }
        document.head.appendChild(script)
        // return () => {
        //     document.head.removeChild(script)
        // }
    }, [url])
    return remoteState
}

type RemoteInfo = {
    /**远程模块得容器uri*/
    url: string
    /**容器名称*/
    scope: any
    /**需要引用得模块名*/
    module: string
}

declare const __webpack_init_sharing__: any
declare const __webpack_share_scopes__: any
const LoadModule = async function ({ scope, module }: RemoteInfo) {
    // Initializes the share scope. This fills it with known provided modules from this build and all remotes
    await __webpack_init_sharing__('default')

    const container: any = window[scope] // or get the container somewhere else
    // Initialize the container, it may provide shared modules
    await container.init(__webpack_share_scopes__.default)
    const factory = await container.get(module)
    let Module = factory()

    if (typeof Module === 'object' && Module.remote) {
        let config = Module.remote
        Module = {
            default: (props: object) => (
                <Parcel
                    wrapWith='div'
                    mountParcel={singleSpa.mountRootParcel}
                    config={config}
                    {...props}
                    reactProps={123456789}
                />
            ),
        }
    }
    return Module
}

export default function useRemoteModule(props: RemoteInfo) {
    if (!props.url) {
        return <h2>url未定义</h2>
    }
    const { failed, ready } = useDynamicScript(props)

    if (!ready) {
        return <h2>Loading dynamic script: {props.url}</h2>
    }

    if (failed) {
        return <h2>Failed to load dynamic script: {props.url}</h2>
    }

    const Module = React.lazy((a) => {
        return LoadModule(props)
    })

    return (
        <React.Suspense fallback='loading module'>
            <Module />
        </React.Suspense>
    )
}
