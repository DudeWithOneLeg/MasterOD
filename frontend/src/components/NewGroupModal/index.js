import { useState } from 'react'
import { useDispatch } from 'react-redux'
import * as resourceGroupActions from '../../store/resourcegroups'


export default function NewGroupModal() {
    const dispatch = useDispatch()
    const [groupName, setGroupName] = useState("")
    const [isPrivate, setIsPrivate] = useState(false)

    const createNewGroup = (e) => {
        e.preventDefault()
    }

    return (
        <div className="w-full h-full bg-zinc-700">
            <form onSubmit={createNewGroup}>
                <input value={groupName} onChange={(e) => setGroupName(e.target.value)}/>
                <select onChange={(e) => setIsPrivate(e.target.value)}>
                    <option value={false}>Public</option>
                    <option value={true}>Private</option>
                </select>
                <div>
                    <button type="submit">Create</button>
                </div>
            </form>
        </div>
    )
}
