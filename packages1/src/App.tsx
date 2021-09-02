import React from 'react'
import ReactDOM from 'react-dom'
import UseRemoteModule from './hook/useRemoteModule'

function App() {
    const [num, setTimer] = React.useState(0)
    React.useEffect(() => {
        let fnum = num
        let timer = setInterval(() => {
            setTimer(fnum++)
        }, 5e3)
        return () => {
            clearInterval(timer)
        }
    }, [])
    return (
        <div style={{ color: 'rgb(53 160 80)' }}>
            <UseRemoteModule scope='packages2' module='widget' reactProps={`timer `} />
            ______________
            <UseRemoteModule scope='packages2' module='widget1' reactProps={`timer${num}`} />
            _______________
            <UseRemoteModule
                scope='packages3'
                module='widget'
                reactProps={`haha , Mrs VUE this information is come from react${num}`}
            />
        </div>
    )
}

ReactDOM.render(<App />, document.getElementById('efos'))
