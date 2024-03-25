import { useState } from "react"

export default function Parameter({query, setQuery, param, text}) {

    const [input, setInput] = useState('')
    const [showInput, setShowInput] = useState(true)

    const handleSubmit = (e) => {
        e.preventDefault()
        if (input.split(param)[1]) {

            const parsed = input.split(text).join(param)
            const q= query
            setQuery([...q,parsed])
            console.log(query)
            setInput('')
        }
    }
    return (
        <form className="flex flex-row items-center" id='parameter' onSubmit={(e) => handleSubmit(e)}>
            {/* {
                !showInput && 'Intitle'
            } */}
            <div className="bg-slate-300 rounded-left my-2 ml-2 px-2">
                {
                    input.split(text)[1] ? text + input.split(text)[1] : text + ''
                }

            </div>
        {
            showInput && <input id='parameter-input' className={`pl-1 pr-0 outline-none ${!input ? 'rounded-right' : ''}`} onChange={(e) => setInput(param + e.target.value || '')} placeholder={''} value={input.split(':')[1] ? input.split(':')[1] : ''}/>
        }
        {
            input && input.split(param)[1] && <button type='submit' className="rounded-right bg-green-400 hover:bg-green-300 px-2">
                <img src='/images/plus.png' className='h-full w-full mr-0 self-end' />

            </button>
        }
        </form>
    )
}
