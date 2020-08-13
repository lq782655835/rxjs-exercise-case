import React, { useState } from 'react'
import './RxjsAPI'

export default function() {
    let [state, setState] = useState(0)
    return <div onClick={() => setState(++state)}>
        hello world,{state}
    </div>
}