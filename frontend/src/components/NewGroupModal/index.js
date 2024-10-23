import { useState, useContext } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { ResultsContext } from '../../context/ResultsContext'
import { useModal } from '../../context/Modal'
import { createResourceGroup, updateGroup } from '../../store/resourcegroups'
import ResourceGroupFilters from '../ResourceGroups/ViewAllGroups/ResourceGroupFilters'
import ResourceGroupCard from '../ResourceGroups/ViewAllGroups/ResourceGroupCard'
import NewGroupForm from './NewGroupForm'

export default function NewGroupModal({ group }) {
    const dispatch = useDispatch()
    const [name, setName] = useState(group?.name || "")
    const [description, setDescription] = useState(group?.description || "")
    const [isPrivate, setIsPrivate] = useState(group ? group.isPrivate : true)
    const [isNewGroup, setIsNewGroup] = useState(true)
    const [existingGroup, setExistingGroup] = useState({})
    const { resourceSelection, setresourceSelection } = useContext(ResultsContext)
    const resourceGroups = useSelector(state => state.resourceGroups.all)
    const navigate = useNavigate()
    const { closeModal, setClassName } = useModal()

    setClassName("relative m-5 rounded-lg z-60 h-fit w-fit flex items-center justify-center overflow-y-auto")

    const createGroup = () => {
        if (resourceSelection.length) {
            dispatch(createResourceGroup({ resources: resourceSelection, group: { name, description, isPrivate } }))
                .then(async data => {
                    if (data.resourceGroupId) {
                        const { resourceGroupId } = data
                        navigate(`/resourceGroup/${resourceGroupId}`)
                    }
                })
            closeModal()
        }
    }

    const updateResourceGroup = () => {
        dispatch(updateGroup(group.id, { name, description, isPrivate }))
        closeModal()
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        if (group?.id) {
            console.log('this hit')
            updateResourceGroup()
        }
        else createGroup()
        setresourceSelection([])
    }

    return (
        <div className="w-full h-full flex items-center justify-center m-4 text-white rounded !bg-zinc-900">
            <div className='w-full h-full flex flex-col text-white text-xl justify-center items-center pt-4'>
                <div className='h-1/4 flex items-center justify-center'>
                    <h1 className='text-2xl'>Just a few more details</h1>

                </div>
                <form onSubmit={handleSubmit} className='flex flex-col h-2/3 w-full p-4 space-y-2 rounded'>

                    {!group ?
                        <select value={isNewGroup} onChange={(e) => setIsNewGroup(e.target.value === "true" ? true : false)} className='rounded bg-zinc-950 border-2 border-zinc-500 p-1 w-fit' placeholder='New group'>
                            <option value={true}>New</option>
                            <option value={false}>Existing</option>
                        </select> : <></>}

                    {isNewGroup ?
                        <NewGroupForm name={name} setName={setName} description={description} setDescription={setDescription} isPrivate={isPrivate} setIsPrivate={setIsPrivate}/>
                        :
                        <div>
                            <ResourceGroupFilters />
                            <div className='h-96 overflow-y-scroll space-y-1'>

                                {resourceGroups && Object.values(resourceGroups).length && !existingGroup?.id ?
                                    Object.values(resourceGroups).reverse().map(group => {
                                        return (
                                            <ResourceGroupCard group={group} key={group.id} isAddingResources={true} setExistingGroup={setExistingGroup} />
                                        )
                                    })
                                    : <></>}
                                {existingGroup?.id ?
                                    <ResourceGroupCard group={existingGroup} key={existingGroup.id} isAddingResources={true} setExistingGroup={setExistingGroup} />
                                    : <></>}
                            </div>
                        </div>}
                    <div className='flex justify-end'>
                        <button type="submit" className='bg-blue-500 rounded p-2 w-fit hover:bg-blue-400 cursor-pointer'>Save</button>
                    </div>
                </form>
            </div>
        </div>
    )
}
