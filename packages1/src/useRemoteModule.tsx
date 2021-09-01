import React from 'react'
import Parcel from 'single-spa-react/parcel'

const remoteUrlMap = {
    packages2: 'http://localhost:3001/remoteEntry.js',
    packages3: 'http://localhost:3002/remoteEntry.js',
}

const reducer = function (state: object, action: { type: string }) {
    if (action.type === 'load success') {
        return { ...state, failed: false, ready: true }
    }
    return { ...state, failed: true, ready: false }
}

export function useDynamicScript(url: string) {
    const [remoteState, dispatch] = React.useReducer(reducer, { failed: false, ready: false })
    React.useEffect(() => {
        const script = document.createElement('script')
        script.src = url || ''
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

interface RemoteInfo {
    //远程模块得容器uri*/
    url?: string
    /**容器名称*/
    scope: 'packages2' | 'packages3'
    /**需要引用得模块名*/
    module: string
    /**其他任意属性*/
    [props: string]: any
}

declare const __webpack_init_sharing__: any
declare const __webpack_share_scopes__: any
declare const window: {
    packages2: any
    packages3: any
}
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
        const ParcelModule = function (oProps: object) {
            return <Parcel wrapWith='div' mountParcel={singleSpa.mountRootParcel} config={config} {...oProps} />
        }
        Module = {
            default: ParcelModule,
        }
    }
    return Module
}

function UseRemoteModule({ url, scope, module, ...oProps }: RemoteInfo) {
    url = url || remoteUrlMap[scope]

    if (!url) {
        return <h2>url定义错误</h2>
    }

    const { failed, ready } = useDynamicScript(url)

    if (!ready) {
        return <h2>Loading dynamic script: {url}</h2>
    }

    if (failed) {
        return <h2>Failed to load dynamic script: {url}</h2>
    }

    const Module = React.lazy(() => {
        return LoadModule({ scope, module })
    })

    return (
        <React.Suspense fallback='loading module...'>
            <Module {...oProps} />
        </React.Suspense>
    )
}

export default React.memo(UseRemoteModule)
