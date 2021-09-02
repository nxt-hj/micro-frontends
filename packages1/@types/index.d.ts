declare const __webpack_share_scopes__: any
declare const __webpack_init_sharing__: any

declare module 'packages*' {
    const content: any
    export = content
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
