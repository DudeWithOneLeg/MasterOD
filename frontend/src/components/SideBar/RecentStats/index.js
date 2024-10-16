import RecentStat from "../RecentStat";

export default function RecentStats({setSearch, setShowMenu}) {

  const navBarStats = [
    {
      stat: "Saved Searches",
      path: "/search/saved",
    },
    {
      stat: "Recent Searches",
      path: "/search/all",
    },
    {
      stat: "Resources",
      path: "/results/all",
    },
    {
      stat: "Saved Resources",
      path: "/results/saved",
    },
    {
      stat: "Groups",
      path: "/resourceGroups",
    },
  ];

  return Object.values(navBarStats).map((object) => {
    return (
      <RecentStat object={object} setSearch={setSearch} setShowMenu={setShowMenu}/>
    );
  });
}
