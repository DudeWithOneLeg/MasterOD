import { useSelector } from "react-redux"
import ResourceGroupFilters from "./ResourceGroupFilters"
import ResourceGroupCard from "./ResourceGroupCard"

export default function MobileViewAllGroups() {
    const resourceGroups = useSelector(state => state.resourceGroups.all)

    return(
        <div className="h-full w-full flex flex-col items-center px-3">
            <div className="w-full flex items-center justify-center flex-col">
                <ResourceGroupFilters />

            <div className="space-y-2 h-full overflow-y-scroll w-full">
                <div className="w-full flex flex-row text-white text-xl border-b divide-x">
                    <div className="w-full flex justify-center">
                        <p>Name</p>
                    </div>
                    <div className="w-full flex justify-center">
                        <p>Visibility</p>
                    </div>
                    <div className="w-full flex justify-center">
                        <p>Resources</p>
                    </div>
                </div>
                {resourceGroups && Object.values(resourceGroups).length ?
                    Object.values(resourceGroups).reverse().map(group => {
                        return (
                            <ResourceGroupCard group={group}/>
                        )
                    })
                    : <></>}
            </div>
            </div>
        </div>
    )
}
