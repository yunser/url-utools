import { useEffect, useState } from 'react'
import './app.less'

function App() {

    const [list, setList] = useState([])
    const [msg] = useState('React')

    useEffect(() => {
        setList(window._plugin.getList())
    }, [])

    return (
        <div className="app">
            <div>已加载 {list.length} 条数据</div>
            {/* <div className="hello">Hello {msg}</div> */}
            {/* <div>
                <button
                    onClick={() => {
                        alert('hello')
                    }}
                >Send Message</button>
            </div> */}
        </div>
    )
}
export default App
