import React from 'react'
import ReactDOM from 'react-dom'
import useRemoteModule from './useRemoteModule'
function App() {
    const RemoteModule: JSX.Element = useRemoteModule({
        url: 'http://localhost:30001/remoteEntry.js',
        scope: 'packages2',
        module: 'widget',
    })
    const RemoteModule2: JSX.Element = useRemoteModule({
        url: 'http://localhost:30001/remoteEntry.js',
        scope: 'packages2',
        module: 'widget1',
    })
    const RemoteModule3: JSX.Element = useRemoteModule({
        url: 'http://localhost:30002/remoteEntry.js',
        scope: 'packages3',
        module: 'widget',
    })
    return (
        <div style={{ color: 'rgb(53 160 80)' }}>
            ________________________
            {RemoteModule}
            ______________
            {RemoteModule2}
            ______________
            {RemoteModule3}
        </div>
    )
}

ReactDOM.render(<App />, document.getElementById('efos'))
