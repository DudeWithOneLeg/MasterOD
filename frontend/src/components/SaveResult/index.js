import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as resultActions from "../../store/result";

export default function SaveResult({ result, saved, setSaved, className }) {
  const dispatch = useDispatch();
  const [lastSearchId, setLastSearchId] = useState(0)
  const lastSearch = useSelector(
    (state) => state.search.recentQueries
  );

  useEffect(()=> {
    if (lastSearch && Object.values(lastSearch)[0]) {
      setLastSearchId(Object.values(lastSearch)[0].id)
    }
  },[lastSearch])

  const saveResult = () => {
    const newResult = {
      title: result.title,
      snippet: result.snippet,
      link: result.link,
      queryId: lastSearchId,
    };

    dispatch(resultActions.postSavedResult(newResult, result.id));
    setSaved(true);
  };

  const deleteResult = () => {
    dispatch(resultActions.deleteResult(result.id))
    setSaved(false)
  }

  return saved || result.saved ? (
    <img onClick={deleteResult} src={require("../../assets/icons/bookmark_FILL.png")} className={className} />
  ) : (
    <img onClick={saveResult} src={require("../../assets/icons/bookmark.png")} className={className} />
  );
}
