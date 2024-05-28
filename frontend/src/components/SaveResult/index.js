import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as resultActions from "../../store/result";

export default function SaveResult({ result, saved, setSaved }) {
  const dispatch = useDispatch();
  const lastSearchId = useSelector(
    (state) => Object.values(state.search.recentQueries)[0].id
  );

  useEffect(() => {console.log(result)},[result])

  const saveResult = () => {
    const newResult = {
      title: result.title,
      snippet: result.snippet,
      link: result.link,
      queryId: lastSearchId,
    };

    dispatch(resultActions.postSavedResult(newResult));
    setSaved(true);
  };

  const deleteResult = () => {
    dispatch(resultActions.deleteResult(result.id))
    setSaved(false)
  }

  return saved || result.saved ? (
    <img onClick={deleteResult} src={require("../../assets/icons/bookmark_FILL.png")} />
  ) : (
    <img onClick={saveResult} src={require("../../assets/icons/bookmark.png")} />
  );
}
