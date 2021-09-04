
/**@keep 
 * 这是远程引用模块方法的注释
 */
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

declare const window: {
    packages2: any
    packages3: any
}

const LoadModule = function ({ url, scope, module, ...oProps }: RemoteInfo) {
    const [Module, setModule] = React.useState<Function | null>(null)

    React.useEffect(() => {
        // Initializes the share scope. This fills it with known provided modules from this build and all remotes
        // await __webpack_init_sharing__('default')

        const container: any = window[scope] // or get the container somewhere else
        // Initialize the container, it may provide shared modules
        container.init(__webpack_share_scopes__.default)
        container.get(module).then((factory: Function) => {
            let RModule = factory(),
                Module = null

            Module = function () {
                return (oProps: object) => <RModule.default {...oProps} />
            }

            if (typeof RModule === 'object' && RModule.remote) {
                Module = function () {
                    return (oProps: object) => (
                        <Parcel
                            wrapWith='div'
                            mountParcel={singleSpa.mountRootParcel}
                            config={RModule.remote}
                            {...oProps}
                        />
                    )
                }
            }

            setModule(Module)
        })
    }, [url, scope, module])

    if (!Module) {
        return null
    }

    return Module(oProps)
}

function UseRemoteModule({ url, scope, module, ...oProps }: RemoteInfo) {
    url = url || remoteUrlMap[scope]

    if (!url) {
        return <h2>url定义错误</h2>
    }

    const { failed, ready } = useDynamicScript(url)

    if (!ready) {
        return <h2>Loading Module...</h2>
    }

    if (failed) {
        return <h2>Failed to load Module</h2>
    }

    return <LoadModule url={url} scope={scope} module={module} {...oProps} />
}

export default React.memo(UseRemoteModule)
