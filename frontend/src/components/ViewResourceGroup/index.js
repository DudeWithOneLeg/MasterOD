import { useEffect, useState, useContext, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import Results from "../Results"
import Browser from "../Browser"
import { ResultsContext } from "../../context/ResultsContext"
import * as resourceGroupActions from '../../store/resourcegroups'
import DynamicOGMeta from "../DynamicOGMeta"
import OpenModalButton from "../OpenModalButton"
import NewGroupModal from "../NewGroupModal"
import editIcon from '../../assets/images/edit.png'
import checkboxIcon from '../../assets/images/checkbox.png'

export default function ViewResourceGroup() {
    const params = useParams()
    const { resourceGroupId, shareUrl } = params
    const [group, setGroup] = useState({})
    const [resources, setResources] = useState({})
    const { preview, showResult, result, groupSelection } = useContext(ResultsContext)
    const dispatch = useDispatch()


    useEffect(() => {
        dispatch(resourceGroupActions.fetchResourceGroup(resourceGroupId, shareUrl))
    }, [dispatch, resourceGroupId])

    const resourceGroup = useSelector(state => state.resourceGroups.resourceGroup)
    useEffect(() => {
        if (resourceGroup?.group && resourceGroup.resources) {
            setGroup(resourceGroup.group)
            setResources(resourceGroup.resources)
        }
    }, [resourceGroup])


    return (
        <div className="w-full text-white flex justify-center h-full">
            {group?.id ?
                <div className={`w-full flex flex-col ${(showResult && resources) || (showResult && preview) ? 'items-start' : 'items-center'} h-full`}>
                    <DynamicOGMeta group={group} />
                    <div className={`${((showResult && resources) || (showResult && preview)) ? 'w-1/2' : 'w-full'} flex flex-col justify-center items-center py-2`}>
                        <div className="text-2xl flex flex-row items-center space-x-2">
                            <h1>{group.name}</h1>
                            <OpenModalButton modalComponent={<NewGroupModal group={group} />} buttonImg={<img src={editIcon} className="h-full" />} className="focus:outline-none rounded-full h-8" />
                        </div>
                        <div>
                            <p>{group.description}</p>
                        </div>
                    </div>
                    <div className={`w-1/2 h-8 flex flex-row items-center`}>
                        <img src={checkboxIcon} className="h-full"/>
                        <p>Select</p>
                    </div>
                    <div className="w-full h-full flex flex-row">
                        <Results data={resources} />
                        {(showResult && resources) || (showResult && preview) ? (
                            <Browser />
                        ) : (
                            <></>
                        )}
                    </div>
                </div> : <></>}
        </div>
    )
}
