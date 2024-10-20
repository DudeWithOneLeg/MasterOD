import { useState, useContext } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { ResultsContext } from '../../context/ResultsContext'
import { useModal } from '../../context/Modal'
import * as resourceGroupActions from '../../store/resourcegroups'


export default function NewGroupModal({group}) {
    const dispatch = useDispatch()
    const [name, setName] = useState(group?.name || "")
    const [description, setDescription] = useState(group?.description || "")
    const [isPrivate, setIsPrivate] = useState(group ? group.isPrivate : true)
    const { groupSelection } = useContext(ResultsContext)
    const navigate = useNavigate()
    const {closeModal} = useModal()

    const createResourceGroup = () => {
        if (groupSelection.length) {
            dispatch(resourceGroupActions.createResourceGroup({resources: groupSelection, group: {name, description, isPrivate} }))
            .then(async data => {
                if (data.resourceGroupId) {
                    const {resourceGroupId} = data
                    navigate(`/resourceGroup/${resourceGroupId}`)
                }
            })
            closeModal()
        }
    }

    const updateResourceGroup = () => {
        dispatch(resourceGroupActions.updateResourceGroup(group.id, {name, description, isPrivate}))
        closeModal()
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (group?.id) {
            updateResourceGroup()
        }
        else createResourceGroup()
    }

    return (
        <div className="w-96 h-full flex items-center justify-center m-4 text-white rounded !bg-zinc-900">
            <div className='w-full h-full flex flex-col text-white text-xl justify-center items-center pt-4'>
                <div className='h-1/4 flex items-center justify-center'>
                    <h1 className='text-2xl'>Just a few more details</h1>

                </div>
                <form onSubmit={handleSubmit} className='flex flex-col h-2/3 w-full p-4 space-y-2 rounded'>
                    <label className='flex flex-col space-y-2'>
                        Group Name:
                        <input value={name} onChange={(e) => setName(e.target.value)} className='rounded bg-zinc-950 border-2 border-zinc-500 pl-2' placeholder='New group'/>
                    </label>
                    <label className='flex flex-col space-y-2'>
                        Description:
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} className='rounded bg-zinc-950 border-2 border-zinc-500 pl-2' />
                    </label>
                    <label className='flex flex-col space-y-2'>
                        Visibility:
                        <select onChange={(e) => setIsPrivate(e.target.value)} className='bg-black w-fit cursor-pointer' value={isPrivate}>
                            <option value={true}>Private</option>
                            <option value={false}>Public</option>
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
