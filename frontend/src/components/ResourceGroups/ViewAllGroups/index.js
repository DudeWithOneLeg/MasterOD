import { useSelector } from "react-redux"
import ResourceGroupFilters from "./ResourceGroupFilters"
import ResourceGroupCard from "./ResourceGroupCard"
import MobileViewAllGroups from "./MobileViewAllGroups"
import { isMobile } from "react-device-detect"

export default function ViewAllGroups() {
    const resourceGroups = useSelector(state => state.resourceGroups.all)

    if (isMobile) return <MobileViewAllGroups />

    return (
        <div className="h-full w-full flex flex-col items-center">
            <div className="md:w-full lg:w-full xl:w-full 2xl:w-1/2 flex items-center justify-center flex-col h-full">
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
                                <ResourceGroupCard group={group} key={group.id}/>
                            )
                        })
                        : <></>}
                </div>
            </div>
        </div>
    )
}
