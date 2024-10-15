import { useState, useContext } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { ResultsContext } from '../../context/ResultsContext'
import { useModal } from '../../context/Modal'
import * as resourceGroupActions from '../../store/resourcegroups'


export default function NewGroupModal() {

    const dispatch = useDispatch()
    const [groupName, setGroupName] = useState("")
    const [groupDescription, setGroupDescription] = useState("")
    const [isPrivate, setIsPrivate] = useState(true)
    const { groupSelection } = useContext(ResultsContext)
    const navigate = useNavigate()

    const createResourceGroup = (e) => {
        e.preventDefault()
        if (groupSelection.length) {
            dispatch(resourceGroupActions.createResourceGroup({resources: groupSelection, group: {name: groupName, description: groupDescription, isPrivate} }))
            .then(async data => {
                if (data.resourceGroupId) {
                    const {resourceGroupId} = data
                    navigate(`/resourceGroup/${resourceGroupId}`)
                }
            })
            closeModal()
        }
    }
    const {closeModal} = useModal()

    return (
        <div className="w-full h-full flex items-center justify-center p-4 text-white">
            <div className='w-1/2 h-full flex flex-col text-white text-xl justify-center items-center !bg-zinc-900'>
                <div className='h-1/4 flex items-center justify-center'>
                    <h1 className='text-2xl'>Just a few more details</h1>

                </div>
                <form onSubmit={createResourceGroup} className='flex flex-col h-2/3 w-full p-4 space-y-2 rounded'>
                    <label className='flex flex-col space-y-2'>
                        Group Name:
                        <input value={groupName} onChange={(e) => setGroupName(e.target.value)} className='rounded bg-zinc-950 border-2 border-zinc-500 pl-2' placeholder='New group'/>
                    </label>
                    <label className='flex flex-col space-y-2'>
                        Description:
                        <textarea value={groupDescription} onChange={(e) => setGroupDescription(e.target.value)} className='rounded bg-zinc-950 border-2 border-zinc-500 pl-2' />
                    </label>
                    <label className='flex flex-col space-y-2'>
                        Visibility:
                        <select onChange={(e) => setIsPrivate(e.target.value)} className='bg-black w-fit cursor-pointer'>
                            <option value={false}>Public</option>
                            <option value={true}>Private</option>
                        </select>

                    </label>
                    <div className='flex justify-end'>
                        <button type="submit" className='bg-blue-500 rounded p-2 w-fit hover:bg-blue-400 cursor-pointer'>Save</button>
                    </div>
                </form>
            </div>
        </div>
    )
}
