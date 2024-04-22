export default function SideBar({user}) {
  return (
    <div className="h-full w-1/5 bg-slate-500 overflow-hidden text-slate-200">
      <div className="p-4">
        <div className="flex flex-row items-center">
          <img src="icons/profile.jpg" className="rounded-full h-14"></img>
          {/* <p className="pl-4">{user.username}</p> */}
        </div>
        <div className="p-4 text-lg divide-y">
            <p className="p-2">Saved Queries</p>
            <p className="p-2">Recent Queries</p>
            <p className="p-2">Visited</p>
            <p className="p-2">Saved Sites</p>
            <p className="p-2">Site History</p>
        </div>
      </div>
    </div>
  );
}
