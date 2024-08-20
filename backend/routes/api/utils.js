const getClosestArchive = async (url) => {
  if (url.includes('https://')) url = url.split('https://').join('')
  if (url.includes('http://')) url = url.split('http://').join('')
  // const res = await fetch(`https://archive.org/wayback/available?url=${url}`)
  const resExtra = await fetch(`https://web.archive.org/cdx/search/cdx?url=${url}&output=json`)

  try {
    const datExtra = await resExtra.json()
    // const data = await res.json()
    const obj = {}

    let id = 0
    for (snapshot of datExtra.slice(1)) {
      const year = snapshot[1].slice(0, 4);
      const month = snapshot[1].slice(4, 6) - 1; // Months are 0-indexed in JS
      const day = snapshot[1].slice(6, 8);
      const hours = snapshot[1].slice(8, 10);
      const minutes = snapshot[1].slice(10, 12);
      const seconds = snapshot[1].slice(12, 14);
      obj[id] = {
        url: `https://web.archive.org/web/${snapshot[1]}/${snapshot[2]}`,
        date: new Date(year, month, day, hours, minutes, seconds),
        mimeType: snapshot[3]
      }
      id++
    }
    // const data = await res.json()
    
    return {snapshots: obj}

  } catch (error) {
    console.log(error)
  }
};

const getPdfs = (array) => array.filter(list => list.includes('application/pdf'))

const getPowerpoints = (array) => array.filter(list => list.icludes('application/powerpoint'))

const getDocs = (array) => array.filter(list => list.includes('application/msword'))

module.exports = { getClosestArchive, getPdfs, getDocs, getPowerpoints };
