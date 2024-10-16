export const SelectEngine = (props) => {
    return (
        <div className="flex h-full justify-content-start items-center">

            <select
                className="mx-2 text-slate-600 cursor-pointer rounded focus:outline-none"
                onChange={(e) => props.setEngineFilter(e.target.value.toLocaleLowerCase())}
            >
                <option selected disabled>Engine</option>
                <option value={"all"} >All</option>
                <option value={"google"}>Google</option>
                <option value={"bing"}>Bing</option>
            </select>
        </div>
    );
};
