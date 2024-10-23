import RecentStat from "../RecentStat";

export default function RecentStats({setSearch, setShowMenu}) {

  const navBarStats = [
    {
      stat: "Searches",
      subPath: "/search",
      options: [
        {
          name: 'Recent',
          path: "/search/all",
        },
        {
          name: 'Saved',
          path: "/search/saved",
        }
      ]
    },
    {
      stat: "Resources",
      subPath: "/results",
      options: [
        {
          name: 'Recent',
          path: "/results/all",
        }, {
          name: 'Saved',
          path: "/results/saved",
        }
      ]
    },
    {
      stat: "My Groups",
      path: "/resourceGroups",
    },
  ];

  return Object.values(navBarStats).map((object) => {
    return (
      <RecentStat object={object} setSearch={setSearch} setShowMenu={setShowMenu}/>
    );
  });
}
