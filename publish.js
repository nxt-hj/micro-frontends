//  npm run publish arg1 arg2 arg3
//                 环境 分支 平台

/**
 *  环境标识符
 *  dev    => 开发 192.168.1.34
 *  test   => 内测 192.168.1.37
 *  rel    => 预发布 testoms.eegrid.com
 *  mrel   => 微软预发布 mtestoms.eegrid.com
 *  prod   => 准备上线（发到预发布某个文件夹，通知运维人员拷贝至正式环境）
 */

const http = require('http')
const os = require('os')
const hostname = os.hostname()

//发布分支默认为master，发布平台默认为uds
const [env, branch = 'master', platform = 'uds'] = JSON.parse(process.env.npm_config_argv).remain

if (!env) {
    _console('FAILURE', '需要指定发布环境，npm run publish [env]')
    return
}
if (!branch) {
    _console('FAILURE', '需要指定分支名，npm run publish [env] [branch]')
    return
}

const jenkinsDelay = 2
const jenkinsUrl = 'http://192.168.1.38:8080'
const jenkinsToken = `efos3.0-${env}-jenkins-token`

const requestUrl = `${jenkinsUrl}/generic-webhook-trigger/invoke?token=${jenkinsToken}&jobQuietPeriod=${jenkinsDelay}&cause=${hostname}&branchName=${branch}&platform=${platform}&remoteUrl=${getIPAdress()}`

http.get(requestUrl, (res) => {
    const { statusCode, statusMessage } = res
    // const contentType = res.headers['content-type']

    // statusCode: 201
    // statusMessage: 'Created'
    let error
    // 任何 2xx 状态码都表示成功响应，但这里只检查 200。201
    if (statusCode != 200 && statusCode != 201) {
        error = new Error('Request Failed. ' + `Status Code: ${statusCode} ${statusMessage}`)
    }
    if (error) {
        _console('FAILURE', error.message)
        // 消费响应数据以释放内存
        res.resume()
        exit()
        return
    }
    console.log('create', 'jenkins', 'Job', statusMessage)
    setTimeout(
        console.log,
        1e3,
        `publish the ${platform.toUpperCase()} platform at the ${branch} branch to the ${env} environment`
    )
    setTimeout(console.log, 2e3, 'waiting for executing...')
}).on('error', (e) => {
    console.log(getColor('FAILURE'), ' 请检查jenkins服务是否开启')
    exit()
    // console.error(`Got error: ${e.message}`)
})

function getIPAdress() {
    let interfaces = os.networkInterfaces()
    for (var devName in interfaces) {
        var iface = interfaces[devName]
        for (var i = 0; i < iface.length; i++) {
            let alias = iface[i]
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                return alias.address
            }
        }
    }
}

//背景编号：40黑，41红，42绿，43黄，44蓝，45紫，46深绿，47白色
//字色编号：30黑，31红，32绿，33黄，34蓝，35紫，36深绿，37白色
function getColor(state) {
    switch (state) {
        case 'SUCCESS':
            return '\033[0;32m'
        case 'UNSTABLE':
        case 'ABORTED':
            return '\033[0;33m'
        case 'FAILURE':
            return '\033[0;31m'
    }
}

function consoleState(result) {
    console.log(getColor(result), 'publish', result, '' + (+new Date() - createDate) / 1000, 's')
}

function _console(result, string) {
    console.log(getColor(result), string)
}

function exit() {
    server.close()
    process.exit()
}
//Successfully
const createDate = +new Date()

const server = http
    .createServer((req, res) => {
        const result = req.url.split('=')[1] || 'FAILURE'
        consoleState(result)
        exit()
    })
    .listen(8087)
