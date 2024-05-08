const express = require("express");
const router = express.Router();
const SerpApi = require("google-search-results-nodejs");
require("dotenv").config();
const SERP_API_ACCESS_KEY = process.env.SERP_API_ACCESS_KEY;
const search = new SerpApi.GoogleSearch(SERP_API_ACCESS_KEY);
const fs = require("fs");
const { getArchive } = require("./utils");
const { Queries } = require("../../db/models");

router.post("/iframe/", async (req, res) => {
  const { url } = req.body;
  const data = await fetch(url)
    .then(async (res) => {
      if (res.status == 200) {
        return res.text();
      }
    })
    .then(async (data) => {
      const response = data;
      return response;
    })
    .catch((e) => console.log(e));

  return res.json({ data });
});
router.post("/", async (req, res) => {
  //   const { query, lat, lng } = req.body;
  const quote = ["intitle", "inurl", "-intitle", "-inurl", "intext", "-intext"];
  const params = req.body;
  const { user } = req;
  params.q = params.q
    .split(";")
    .map((q) =>
      q.includes(":")
        ? `${q.split(":")[0]}:"${q.split(":")[1]}"`
        : '"' + q + '"'
    )
    .join(" ");
  const newQuery = {
    userId: user.id,
    query: params.q,
    engine: params.engine,
  };

  await Queries.create(newQuery);

  const recentQueries = await Queries.findAll({
    where: {
      userId : user.id,
    },
    order: [['updatedAt', 'DESC']],
    limit: 5
  })

  console.log(params, "47");

  const obj = {};
  const callback = async (data) => {
    const response = data.organic_results;
    // console.log(response);
    // console.log(data.search_information.total_results);
    // console.log(data.search_parameters);
    // console.log(data.serpapi_pagination);

    if (data.organic_results) {
      const results = async (rest) => {
        const index = {};
        // console.log(rest, 'hello')
        Object.values(rest).forEach(async (resp) => {
          const link = resp.link;
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

          if (Object.values(obj).length == Object.values(response).length) {
            const currPage = (
              Number(data.organic_results?.slice(-1)[0].position) / 100
            ).toFixed();
            // console.log(data)
            const totalPages = (
              Number(data.search_information.total_results) /
              data.organic_results?.length
            ).toFixed(0);
            obj.info = {
              currentPage: currPage,
              totalPages,
            };
            return res.json({results: obj, recentQueries});
          }
        });
      };

      await results(response);
    } else {
      res.json({ message: "End of results" });
    }

    // console.log(currPage + "/" + totalPages);

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

  // console.log(final);
  const request = {
    // start_addr: `${lat},${lng}`,
    // end_addr: "hebron train station",
    // engine: "google_maps_directions",
    ...params,
    num: 100,
    // ll:`@${lat},${lng}`
    // device: "tablet",
    // travel_mode: 3,
  };
  console.log(request);
  try {
    await search.json(request, callback);
  } catch (error) {
    console.log(error);
  }
});

router.get('/queries/recent', async (req, res) => {
  const { user } = req
  if (user) {

    const recentQueries = await Queries.findAll({
      where: {
        userId : user.id,
      },
      order: [['updatedAt', 'DESC']],
      limit: 5
    })
    // console.log(recentQueries)
    res.status(200)
    // console.log(res)
    return res.json(recentQueries)
  }
})

module.exports = router;
