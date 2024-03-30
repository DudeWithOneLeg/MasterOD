const express = require("express");
const router = express.Router();
const SerpApi = require("google-search-results-nodejs");
require("dotenv").config();
const SERP_API_ACCESS_KEY = process.env.SERP_API_ACCESS_KEY;
const search = new SerpApi.GoogleSearch(SERP_API_ACCESS_KEY);
const fs = require("fs");
const { getArchive } = require("./utils");

router.post('/iframe/', async (req, res) => {
  const { url } = req.body
  const data = await fetch(url)
  .then(async res => {
    if (res.status == 200) {
      return res.text()
    }
  })
  .then(async data => {
    const response =  data
    return response
  }).catch(e => console.log(e))

  return res.json({data})

})
router.post("/", async (req, res) => {
  //   const { query, lat, lng } = req.body;
  const quote = ["intitle", "inurl", "-intitle", "-inurl", "intext", "-intext"];
  const { query } = req.body;
  const limit = 100;

  const final = query
    .split(" ")
    .map((q) =>
      quote.includes(q.split(":")[0])
        ? `${q.split(":")[0]}:"${q.split(":")[1]}"`
        : q
    )
    .join(" ");

  const obj = {};
  const callback = async (data) => {
    const response = data.organic_results;
    console.log(data.search_information.total_results);
    console.log(data.organic_results.length);

    if (data.organic_results) {
      const results = async (rest) => {
        const index = {};
        // console.log(rest, 'hello')
        Object.values(rest).forEach(async (resp) => {
          const link = resp.link;
          // .split("/").slice(0, 3).join('').split(':').join('://');
          console.log(resp.link);
          console.log(link);
          if (!index[link]) {
            await getArchive(link).then(async (archive) => {
              // console.log(archive, 'hello')
              index[link] = archive;
              obj[resp.position] = {
                id: resp.position,
                title: resp.title,
                link: resp.link,
                snippet: resp.snippet,
                archive: archive,
              };
              // console.log(archive);
            });
          } else {
            obj[resp.position] = {
              id: resp.position,
              title: resp.title,
              link: resp.link,
              snippet: resp.snippet,
              archive: index[link],
            };
          }

          if (Object.values(obj).length == Object.values(response).length)
            return res.json(obj);
        });
      };

      await results(response);
    }

    //   console.log(data.directions[0].start_time.split('').slice(0, 5).join('').split(':'));
    // const lastItem = data.organic_results.slice(-1)[0].position;
    const currPage = (
      data.organic_results?.slice(-1)[0].position / 100
    ).toFixed();
    const totalPages = (
      data.search_information.total_results / data.organic_results?.length
    ).toFixed(0);
    console.log(currPage + "/" + totalPages);

    // const totalResults = data.search_information.total_results
    // const totalPages = data.search_information.total_results / 100

    //     await fetch(data.search_metadata.google_maps_url)
    //     .then(async res => {
    //         if (res.status == 200) return await res.text()
    //     })
    // .then(async data => {
    //     fs.writeFileSync('test.html', data)
    // })

    // console.log('Results:', totalResults)
    // console.log('Pages: ', totalPages)

    // const
  };

  let start = 0;
  console.log(final);
  const request = {
    // start_addr: `${lat},${lng}`,
    // end_addr: "hebron train station",
    // engine: "google_maps_directions",
    q: final,
    engine: "google",
    num: 100,
    start: start,
    // ll:`@${lat},${lng}`
    // device: "tablet",
    // travel_mode: 3,
  };
  const test = async () => {
    await search.json(request, callback);
  };
  await test();
  //   console.log(data)

  //   res.json(data);
});


module.exports = router;
