import { useSelector } from "react-redux";
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
      stat: "Result History",
      path: "/results/all",
    },
    {
      stat: "Saved Results",
      path: "/results/saved",
    },
  ];

  return Object.values(navBarStats).map((object) => {
    return (
      <RecentStat object={object} setSearch={setSearch} setShowMenu={setShowMenu}/>
    );
  });
}
