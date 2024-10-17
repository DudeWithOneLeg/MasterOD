import { useSelector } from "react-redux"
import ResourceGroupFilters from "./ResourceGroupFilters"
import ResourceGroupCard from "./ResourceGroupCard"

export default function ViewAllResourceGroups() {
    const resourceGroups = useSelector(state => state.resourceGroups.all)

    return(
        <div className="h-full w-4/5 flex flex-col items-center">
            <div className="w-1/2 flex items-center justify-center">
                <ResourceGroupFilters />

            </div>
            <div className="space-y-2 h-full overflow-y-scroll w-full">
                {resourceGroups && Object.values(resourceGroups).length ?
                    Object.values(resourceGroups).reverse().map(group => {
                        return (
                            <ResourceGroupCard group={group}/>
                        )
                    })
                    : <></>}
            </div>
        </div>
    )
}
