import { useNavigate } from "react-router-dom"
import OpenModalButton from '../OpenModalButton'
import Sharing from "../Sharing"
import moreVert from '../../assets/images/more_vert.png'

export default function ResourceGroupCard({group}) {
    const navigate = useNavigate()

    const handleRedirect = () => {
        navigate(`/resourceGroup/${group.id}`)
    }

    return(
        <div className="text-white w-full min-h-10 max-h-fit flex flex-row rounded bg-zinc-800 hover:bg-zinc-700 cursor-pointer relative">
            <div onClick={handleRedirect} className="w-full flex flex-row">

                <div className="w-full flex items-center justify-center">
                    <p>
                        {group.name}
                    </p>
                </div>
                <div className="w-full flex items-center justify-center">
                    <p>
                        {group.isPrivate ? "Private" : "Public"}
                    </p>
                </div>
                <div className="w-full flex items-center justify-center">
                    <p>
                        {group.numberResources}
                    </p>
                </div>
            </div>
            <div className="absolute h-4/5 right-0">

                <OpenModalButton buttonImg={<img src={moreVert} className="h-4/5"/>} modalComponent={<Sharing shareUrl={group.shareUrl}/>} className={'h-full focus:outline-none'}/>
            </div>
        </div>
    )
}
