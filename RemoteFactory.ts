class ReactRemoteComponent {
    constructor(config: RemoteConfig) {}
}
class VueRemoteComponent {
    constructor(config: RemoteConfig) {}
}
class AngularRemoteComponent {
    constructor(config: RemoteConfig) {}
}

export class RemoteComponentFactory {
    type: FrameworkType
    config: RemoteConfig
    constructor(type: FrameworkType) {
        this.type = type
    }

    get(config: RemoteConfig) {
        this.config = config
        return new Promise((resolve, reject) => {
            this.dynamicScript()
            if (this.type === 'React') {
                return new ReactRemoteComponent(config)
            }
            if (this.type === 'Vue') {
                return new VueRemoteComponent(config)
            }
            return new AngularRemoteComponent(config)
        })
    }

    private dynamicScript() {
        const { url } = this.config
        const script = document.createElement('script')
        script.src = url
        script.text = 'text/javascript'
        // script.async = true
        script.onload = () => {
            this.loadModule()
            document.head.removeChild(script)
        }
        script.onerror = () => {
            this.log('load remote url error')
        }
        document.head.appendChild(script)
    }

    private loadModule() {
        const { scope, module } = this.config
        await __webpack_init_sharing__('default')

        const container: any = window[scope] // or get the container somewhere else
        // Initialize the container, it may provide shared modules
        await container.init(__webpack_share_scopes__.default)
        const factory = await container.get(module)
        let Module = factory()

        if (typeof Module === 'object' && Module.remote) {
            let config = Module.remote
            Module = {
                default: () => <Parcel wrapWith='div' mountParcel={singleSpa.mountRootParcel} config={config} />,
            }
        }
        return Module
    }

    private log(info: string) {
        console.log(info)
    }
}
declare const __webpack_init_sharing__: any
declare const __webpack_share_scopes__: any
interface RemoteConfig {
    /**远程模块得容器uri*/
    url: string
    /**容器名称*/
    scope: any
    /**需要引用得模块名*/
    module: string
}
type FrameworkType = 'React' | 'Vue' | 'Angular'
