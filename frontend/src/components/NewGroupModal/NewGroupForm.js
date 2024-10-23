export default function NewGroupForm({name, setName, description, setDescription, isPrivate, setIsPrivate}) {
    return (
        <div className='h-96 w-96'>
            <label className='flex flex-col space-y-2'>
                Group Name:
                <input value={name} onChange={(e) => setName(e.target.value)} className='rounded bg-zinc-950 border-2 border-zinc-500 pl-2' placeholder='New group' />
            </label>
            <label className='flex flex-col space-y-2'>
                Description:
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} className='rounded bg-zinc-950 border-2 border-zinc-500 pl-2' />
            </label>
            <label className='flex flex-col space-y-2'>
                Visibility:
                <select onChange={(e) => setIsPrivate(e.target.value === "true" ? true : false)} className='bg-black w-fit cursor-pointer' value={isPrivate}>
                    <option value={true}>Private</option>
                    <option value={false}>Public</option>
                </select>
            </label>
        </div>
    )
}
