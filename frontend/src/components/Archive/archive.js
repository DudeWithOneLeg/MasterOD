import {useState} from 'react'

export default function Archive() {
    const [url, setUrl] = useState('')
    const fetchData = async(e) => {
        e.preventDefault()
        const res = await fetch(`http://web.archive.org/cdx/search/cdx?url=${url}&output=json&`)
        const data = await res.json()
        console.log(data)
    }

    return (
        <div>
            <form onSubmit={(e) => fetchData(e)}>
                <input onChange={(e) => setUrl(e.target.value)} value={url}/>
            </form>
        </div>
    )
}
