import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import ResourceGroupCard from "./ResourceGroupCard"
import * as resourceGroupActions from '../../store/resourcegroups'

export default function ViewAllResourceGroups() {
    const dispatch = useDispatch()
    const resourceGroups = useSelector(state => state.resourceGroups.all)

    useEffect(() => {
        dispatch(resourceGroupActions.fetchAllResourceGroups())
    }, [dispatch])

    return(
        <div className="h-full w-full flex flex-col">
            {resourceGroups && Object.values(resourceGroups).length ?
                Object.values(resourceGroups).map(group => {
                    return (
                        <ResourceGroupCard group={group}/>
                    )
                })
                : <></>}
        </div>
    )
}
