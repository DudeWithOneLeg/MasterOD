const getArchive = async (url) => {
  // console.log(url)
  const data = await fetch(`http://archive.org/wayback/available?url=${url}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json(); // Parse response as JSON
    })
    .then(async (data) => {
      // const pdfs = data.filter(list => list.includes('application/pdf'))
      // const powerpoints = data.filter(list => list.icludes('application/powerpoint'))
      // const docs = data.filter(list => list.includes('application/msword'))

      // console.log(data)
      return data
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
  // const data = await res.json()
  // console.log(data.body)
  return data
};

const getPdfs = (array) => array.filter(list => list.includes('application/pdf'))

const getPowerpoints = (array) => array.filter(list => list.icludes('application/powerpoint'))

const getDocs = (array) => array.filter(list => list.includes('application/msword'))

module.exports = { getArchive, getPdfs, getDocs, getPowerpoints };
