import React from 'react'
import ReactDOM from 'react-dom'
import Widget from './widget1'
function App() {
    return (
        <div>
            <Widget />
            <p>haha</p>
        </div>
    )
}

ReactDOM.render(<App />, document.getElementById('efos'))
