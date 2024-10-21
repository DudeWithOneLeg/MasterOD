import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import * as resourceGroupActions from '../../../store/resourcegroups'
import searchIcon from "../../../assets/images/search.png";
import { isMobile } from 'react-device-detect';

export default function ResourceGroupFilters() {
    const [isPrivate, setIsPrivate] = useState("All")
    const [filterInput, setFilterInput] = useState("")
    const [limit, setLimit] = useState(25)
    const dispatch = useDispatch()

    useEffect(() => {
        const options = { limit, filterInput }
        if (isPrivate !== "All") {
            options.isPrivate = (isPrivate === "Public" ? false : true)
        }
        dispatch(resourceGroupActions.fetchAllResourceGroups(options))
    }, [dispatch, isPrivate])

    const handleSubmit = (e) => {
        e.preventDefault()
        const options = { limit, filterInput }
        if (isPrivate !== "All") {
            options.isPrivate = (isPrivate === "Public" ? false : true)
        }
        dispatch(resourceGroupActions.fetchAllResourceGroups(options))
    }

    return (
        <form
            className={`flex justify-center items-center text-white ${!isMobile
                ? "w-full flex-col"
                : "w-full flex-col"
                }`}
            onSubmit={(e) => handleSubmit(e)}
        >
            <div className="flex flex-row p-2 items-center space-x-2 w-full">
                <div
                    className={`rounded-full px-2 py-1 flex justify-between w-full my-2 bg-white/5 backdrop-blur-xl`}
                >
                    <input
                        className="px-1 bg-white/0 rounded w-full outline-none h-full text-white poppins-light text-lg"
                        placeholder="Filter Resources"
                        value={filterInput}
                        onChange={(e) =>
                            setFilterInput(e.target.value.toLowerCase())
                        }
                    />
                    <button
                        type="submit"
                        className="text-black focus:outline-none cursor-pointer rounded-full h-7 w-7"
                    >
                        <img src={searchIcon} className="h-6 w-6 transition-all duration-200 hover:h-7 hover:w-7" alt="search" />
                    </button>
                </div>
                <div>
                    <select
                        className="mx-2 text-slate-600 cursor-pointer rounded"
                        onChange={(e) =>
                            setIsPrivate(e.target.value)
                        }
                        value={isPrivate}
                    >
                        <option>All</option>
                        <option>Public</option>
                        <option>Private</option>
                    </select>
                </div>
                <div>
                    <select
                        className="mx-2 text-slate-600 cursor-pointer rounded"
                        onChange={(e) =>
                            setLimit(Number(e.target.value))
                        }
                        value={limit}
                    >
                        <option>25</option>
                        <option>50</option>
                        <option>100</option>
                    </select>
                </div>
            </div>
        </form>
    )
}
