export default function ResourceGroupCard({group}) {
    return(
        <div className="text-white w-full border min-h-10 max-h-fit flex flex-row">
            <div className="w-full flex items-center justify-center">
                <p>
                    {group.groupName}
                </p>
            </div>
            <div className="w-full flex items-center justify-center">
                <p>
                    {group.isPrivate ? "Private" : "Public"}
                </p>
            </div>
        </div>
    )
}
