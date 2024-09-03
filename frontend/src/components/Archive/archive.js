import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as archiveActions from "../../store/archive";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_green.css";

export default function Archive({ url }) {
  const dispatch = useDispatch();
  const snapshots = useSelector((state) => state.archive.snapshots);

  const [allowedDates, setAllowedDates] = useState([]);
  const [availableYears, setAvailableYears] = useState([]);
  const [availableMonths, setAvailableMonths] = useState([]);
  const [availableDays, setAvailableDays] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedDay, setSelectedDay] = useState("");
  const [archiveUrl, setArchiveUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasResults, setHasResults] = useState(null)
  const iframeRef = useRef(null);

  const monthCode = {
    '01':'Jan',
    '02':'Feb',
    '03':'Mar',
    '04':'Apr',
    '05':'May',
    '06':'Jun',
    '07':'Jul',
    '08':'Aug',
    '09':'Sep',
    '10':'Oct',
    '11':'Nov',
    '12':'Dec',
  }

  useEffect(() => {
    setHasResults(null)
    setLoading(true)
    const filteredDocument = url.includes('https://docs.google.com/gview?embedded=true&url=') ? url.split('https://docs.google.com/gview?embedded=true&url=')[0] : url
    dispatch(archiveActions.getSnapshots({ url: filteredDocument })).then(async (data) => {
      setLoading(false);
      if (data.snapshots['0']) setHasResults(true)
      else setHasResults(false)
    });
  }, [dispatch]);
  useEffect(() => {
    if (snapshots && snapshots.snapshots) {
      const snaphotsArray = Object.values(snapshots.snapshots);
    //   console.log(snaphotsArray);
      if (snaphotsArray.length) {
        const snapshotDates = snaphotsArray.map((snapshot) => snapshot.date.split("T")[0]);
        //   console.log(snapshotDates);
        setAllowedDates(snapshotDates);
        setArchiveUrl(snaphotsArray.slice(-1)[0].url);
      }
    }
  }, [snapshots]);

  useEffect(() => {
    if (allowedDates.length) {
        // console.log(allowedDates)
        const curr = []
      const years = [];
      for (let date of allowedDates) {
        const [year, month, day] = date.split("-");
        // console.log(year)
        if (!years.includes(year)) {
          // console.log(year)
          years.push(year);
        }
      }
      setAvailableYears(years.sort());
      setSelectedYear(years.sort().slice(-1)[0]);
      // console.log(curr)

    }
  }, [allowedDates]);

  //Update available months when a year is selected
  useEffect(() => {
    // console.log('year hitt')
    const months = [];
    for (let date of allowedDates) {
      const [year, month, day] = date.split("-");
      if (year === selectedYear && !months.includes(month)) {
        months.push(month);
      }
    }
    setAvailableMonths(months.sort());
    setSelectedMonth(months.sort().slice(-1)[0]);

  }, [selectedYear]);

  //Update available days when a month is selected
  useEffect(() => {
    // console.log('month hitt')
    setSelectedMonth(availableMonths.slice(-1)[0])
  }, [availableMonths]);

  useEffect(() => {
    const days = [];
    for (let date of allowedDates) {
      const [year, month, day] = date.split("-");
      //   console.log(year, month, day,[selectedYear, selectedMonth, selectedDay])
      if (year === selectedYear && month === selectedMonth && !days.includes(day)) {
        days.push(day);
      }
    }
    setAvailableDays(days.sort());

  },[selectedMonth])


  useEffect(() => {
    setSelectedDay(availableDays?.slice(-1)[0])
  },[availableDays])

  useEffect(() => {
    if (selectedYear && selectedMonth && selectedDay) {

        const selectedDate = `${selectedYear}-${selectedMonth}-${selectedDay}`;
        console.log(selectedDate);
        const newAvailableSnapshots = []

        for (let snapshot of Object.values(snapshots.snapshots)) {
            if (snapshot.date.includes(selectedDate)) {
                newAvailableSnapshots.push(snapshot)
            }
        }

        if (newAvailableSnapshots.length) {

          const snapshot = newAvailableSnapshots.slice(-1)[0]
            // console.log(snapshot.url)
            setArchiveUrl(snapshot.url)
            // console.log(archiveUrl)
        }
    }
  }, [selectedDay]);

  return (
    <div className="flex flex-col w-full h-full">
      <div className="bg-slate-400 text-black flex flex-row p-1">
        <p className="px-1 font-bold">Snapshot:</p>
        {!loading ? (
          <div className="flex flex-row">
            <p className="px-1">Year: </p>
            <select
              onChange={(e) => setSelectedYear(e.target.value)}
              value={selectedYear}
              className="cursor-pointer"
            >
              {availableYears.length ? (
                availableYears.map((year) => {
                  return <option value={year}>{year}</option>;
                })
              ) : (
                <option disabled selcted>None</option>
              )}
            </select>
            <p className="px-1">Month: </p>
            <select
              onChange={(e) => setSelectedMonth(e.target.value)}
              value={selectedMonth}
              className="cursor-pointer"
            >
              {availableMonths.length ? availableMonths.map((month) => {
                return <option value={month}>{monthCode[month]}</option>;
              }):<option disabled selcted>None</option>}
            </select>
            <p className="px-1">Day: </p>
            <select
              onChange={(e) => setSelectedDay(e.target.value)}
              value={selectedDay}
              className="cursor-pointer"
            >
              {availableDays.length ? availableDays.map((day) => {
                return <option value={day}>{day}</option>;
              }):<option disabled selcted>None</option>}
            </select>
          </div>
        ) : (
          <p>Loading</p>
        )}
      </div>
      {hasResults ? <iframe ref={iframeRef} src={archiveUrl} className="w-full h-full" /> : <></>}
      {loading && hasResults === null ? (
        <div className="h-full w-full flex flex-col items-center justify-content-center">
        <img
          src={require("../../assets/icons/loading.png")}
          className="h-26 w-26 rounded-full animate-spin mb-4"
        />
        <p>Grabbing results from the Wayback Machine. This may take a while depending on the number of results.</p>
      </div>
      ) : (
        <></>
      )}
      {!loading && hasResults === false ? <div className="h-full w-full flex flex-col items-center justify-content-center">
        <p>The Wayback Machine has not archived that URL</p>
      </div> : <></>}
    </div>
  );
}
