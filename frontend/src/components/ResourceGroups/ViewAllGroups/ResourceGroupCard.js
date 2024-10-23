import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import OpenModalButton from '../../OpenModalButton'
import Sharing from "../../Sharing"
// import moreVert from '../../assets/images/more_vert.png'
import shareIcon from '../../../assets/images/share.png'

export default function ResourceGroupCard({ group, isAddingResources, setExistingGroup }) {
    const navigate = useNavigate()

    const handleRedirect = () => {
        if (isAddingResources) {
            setExistingGroup(group)
            return
        }
        navigate(`/resourceGroup/${group.id}`)
    }

    const [hover, setHover] = useState(false)
    const [showMenu, setShowMenu] = useState(false)
    const menuRef = useRef(null)

    useEffect(() => {
        // Function to handle clicks outside the menu
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowMenu(false);  // Close the menu if the click is outside
            }
        };

        // Add click event listener to document
        document.addEventListener('mousedown', handleClickOutside);

        // Cleanup function to remove the event listener
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const toggleMenu = () => {
        setShowMenu(!showMenu)
    }

    return (
        <div
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            className="text-white w-full min-h-10 max-h-fit flex flex-row rounded bg-zinc-800 hover:bg-zinc-700 cursor-pointer relative">
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
            <div className="absolute h-full right-0 flex items-center hover:bg-zinc-600">

                {hover ?
                    <OpenModalButton buttonImg={<img src={shareIcon} className="h-6" />} modalComponent={<Sharing shareUrl={group.shareUrl} />} className={'focus:outline-none flex flex-row items-center h-10 hover:bg-zinc-600 px-1'} /> : <></>}
            </div>

        </div>
    )
}
