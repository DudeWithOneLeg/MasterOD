import {useState, useEffect} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import * as archiveActions from '../../store/archive'
import Flatpickr from 'react-flatpickr'
import "flatpickr/dist/themes/material_green.css";

export default function Archive({url}) {
    const dispatch = useDispatch()
    const snapshots = useSelector(state => state.archive.snapshots)
    const [allowedDates, setAllowedDates] = useState([])
    const [availableYears, setAvailableYears] = useState([])
    const [availableMonths, setAvailableMonths] = useState([])
    const [availableDays, setAvailableDays] = useState([])
    const [selectedYear, setSelectedYear] = useState('')
    const [selectedMonth, setSelectedMonth] = useState('')
    const [selectedDay, setSelectedDay] = useState('')
    const [archiveUrl, setArchiveUrl] = useState('')
    const [loading, setLoading] = useState(false)
    // const [url, setUrl] = useState('')
    const fetchData = (e) => {
        e.preventDefault()
        // console.log(data)
    }
    useEffect(() => {
        setLoading(true)
        setAvailableYears([])
        setAvailableDays([])
        setAvailableMonths([])
    },[])

    useEffect(() => {
        dispatch(archiveActions.getSnapshots({url})).then(async() => {
            setLoading(false)
        })

    }, [dispatch])
    useEffect(() => {
        const snaphotsArray = Object.values(snapshots.snapshots)
        console.log(snaphotsArray)
        if (snapshots && snaphotsArray.length) {
            const snapshotDates = snaphotsArray.map(snapshot => snapshot.date.split('T')[0])
            console.log(snapshotDates)
            setAllowedDates(snapshotDates)
            setArchiveUrl(snaphotsArray.slice(-1)[0].url)

        }

    },[snapshots])

    useEffect(() => {
        if (allowedDates.length) {
            for (let date of allowedDates) {
                const [year, month, day] = date.split('-')
                if (!availableYears.includes(year)) {
                    setAvailableYears([...availableYears, year])
                }
            }
            const latestSnapshot = allowedDates.slice(-1)[0].split('-')
            // console.log(latestSnapshot)
            setSelectedYear(latestSnapshot[0])
            setSelectedMonth(latestSnapshot[1])
            setSelectedDay(latestSnapshot[2])

        }
    },[allowedDates])

    useEffect(() => {
        console.log(availableYears)
        setAvailableMonths([])
        for (let date of allowedDates) {
            const [year, month, day] = date.split('-')
            if (year === selectedYear && !availableMonths.includes(month)) {
                setAvailableMonths([...availableMonths, month])
            }
        }
        setSelectedMonth(availableMonths[0])
    },[selectedYear])

    useEffect(() => {
        setAvailableDays([])
        for (let date of allowedDates) {
            const [year, month, day] = date.split('-')
            if (month === selectedMonth && !availableDays.includes(day)) {
                setAvailableDays([...availableDays, day])
            }
        }
        setSelectedDay(availableDays[0])
    },[selectedMonth])


    return (
        <div className='w-full h-full'>
            <div className='bg-slate-400 text-black flex flex-row p-1'>
                <p className='px-1'>Snapshot:</p>
                    {/* <Flatpickr options={{enable: allowedDates}} placeholder='Choose a snapshot' className='pl-1'/> */}
                    {/* <input onChange={(e) => setUrl(e.target.value)} value={url}/> */}
                    <select defaultSelected={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                        {availableYears ? availableYears.sort().map(year => {
                            return <option value={year}>{year}</option>
                        }) : <></>}
                    </select>
                    <select onChange={(e) => setSelectedMonth(e.target.value)}>
                    {availableMonths.sort().map(month => {
                            return <option value={month}>{month}</option>
                        })}
                    </select>
                    <select onChange={(e) => setSelectedDay(e.target.value)}>
                    {availableDays.sort().map(day => {
                            return <option value={day}>{day}</option>
                        })}
                    </select>


            </div>
            {!loading && archiveUrl ? <iframe src={archiveUrl} className='w-full h-full'/> :
            <div className='h-full w-full'>
                <img
              src={require('../../assets/icons/loading.png')}
              className="h-26 w-26 rounded-full animate-spin mb-4"
            />
            </div>
            }
        </div>
    )
}
