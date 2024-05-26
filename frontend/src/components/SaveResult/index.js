import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as resultActions from "../../store/result";

export default function SaveResult({ result, saved, setSaved }) {
  const dispatch = useDispatch();
  const lastSearchId = useSelector(
    (state) => Object.values(state.search.recentQueries)[0].id
  );

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
  }

  return saved || result.queryId? (
    <img onClick={deleteResult} src={require("../../assets/icons/bookmark_FILL.png")} />
  ) : (
    <img onClick={saveResult} src={require("../../assets/icons/bookmark.png")} />
  );
}
