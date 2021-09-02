import React from 'react'
import moment from 'moment'
export default function (props: any) {
    return (
        <div>
            this is widget1 {props?.reactProps} {moment().format('YYYY-MM-DD HH:mm:ss')}
        </div>
    )
}
