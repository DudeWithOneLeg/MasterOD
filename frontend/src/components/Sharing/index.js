import { useState } from 'react'
import { useModal } from '../../context/Modal'
import linkedinLogo from '../../assets/images/linkedin-logo.png'
import xLogo from '../../assets/images/x-logo.png'
import copytoClipboardImg from '../../assets/images/copy.png'

const platformSharing = {
    'x': {
        baseUrl: 'https://x.com/intent/tweet?url='
    },
    'linkedin': {
        baseUrl: 'https://www.linkedin.com/sharing/share-offsite/?url='
    }
}


export default function Sharing({ shareUrl }) {
    const [url, setUrl] = useState(`https://search-deck.com/group/share/${shareUrl}`)
    const [copied, setCopied] = useState(false)

    const copyToClipboard = () => {
        navigator.clipboard.writeText(url)
        setCopied(true)
    };

    const {setClassName} = useModal()
    setClassName("relative m-5 rounded-lg z-60 h-fit w-fit flex items-center justify-center overflow-y-auto")

    return (
        <div className="flex flex-col items-center text-white bg-zinc-800 lg:h-full xl:h-3/4 p-4 w-fit">
            <div className='flex flex-col justify-around h-full w-fit p-2 space-y-4'>

                <div className="w-full text-2xl">
                    <h1>Share</h1>
                </div>
                <div className="flex rounded bg-zinc-700 w-96 flex flex-row justify-between p-2 relative">
                    <input className='h-8 w-full bg-zinc-700 rounded' value={url} />
                    {copied ? <p className='h-8 flex items-center px-1 rounded bg-zinc-900'>Copied</p> : <img src={copytoClipboardImg} className='h-8 cursor-pointer absolute right-0' alt='copy to clipboard' onClick={copyToClipboard}/>}
                </div>
                <div className="w-full flex flex-row space-x-2 justify-around">
                    <div onClick={() => openInNewTab('linkedin', url)} className='h-full cursor-pointer'>
                        <img src={linkedinLogo} className='h-10' alt='linked in'/>
                    </div>
                    <div onClick={() => openInNewTab('x', url)} className='cursor-pointer'>
                        <img src={xLogo} className='h-9' alt='twitter'/>
                    </div>
                    {/* <div>
                            Facebook
                        </div> */}
                </div>
            </div>
        </div>
    )
}
const openInNewTab = (platform, shareUrl) => {
    const { baseUrl } = platformSharing[platform]
    const url = baseUrl + shareUrl
    window.open(url, '_blank', 'noopener,noreferrer');
};
