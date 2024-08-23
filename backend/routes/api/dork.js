const express = require("express");
const router = express.Router();
const SerpApi = require("google-search-results-nodejs");
require("dotenv").config();
const SERP_API_ACCESS_KEY = process.env.SERP_API_ACCESS_KEY;
const search = new SerpApi.GoogleSearch(SERP_API_ACCESS_KEY);
const { getArchive } = require("./utils");
const { Queries, Result } = require("../../db/models");

router.post("/iframe/", async (req, res) => {
  const { link, title, snippet, archive, queryId } = req.body;
  const { user } = req;
  if (user) {
        await Result.create({
          link,
          snippet,
          title,
          queryId,
          userId: user.id,
          saved: false,
        });

    return res.json({data:''});
  }
  // console.log(req.body)
});

router.post("/", async (req, res) => {
  //   const { query, lat, lng } = req.body;
  // const quote = ["intitle", "inurl", "-intitle", "-inurl", "intext", "-intext"];
  const params = req.body;
  console.log(params);
  const { user } = req;
  params.q = params.q
    .split(";")
    .map((q) =>
      q.includes(":") ? (!q.includes('site') ? `${q.split(":")[0]}:"${q.split(":")[1]}"` : `${q.split(":")[0]}:${q.split(":")[1]}`) : ""
    )
    .join(" ");
  const newQuery = {
    userId: user.id,
    query: params.q,
    engine: params.engine,
    string: params.string,
  };

  await Queries.create(newQuery);

  const recentQueries = await Queries.findAll({
    where: {
      userId: user.id,
    },
    order: [["updatedAt", "DESC"]],
    limit: 5,
  });

  // console.log(params, "47");

  const obj = {};
  const callback = async (data) => {
    const response = data.organic_results;
    // console.log(response);
    // console.log(data.search_information.total_results);
    // console.log(data.search_parameters);
    // console.log(data.serpapi_pagination);

    // console.log(data);
    if (data.organic_results) {
      const results = async (rest) => {
        const index = {};
        // console.log(rest, 'hello')
        Object.values(rest).forEach(async (resp) => {
          const link = resp.link;
          if (!index[link]) {
            obj[resp.position] = {
              id: resp.position,
              title: resp.title,
              link: resp.link,
              snippet: resp.snippet,
              // archive: archive,
            };
            // await getArchive(link).then(async (archive) => {
            //   // console.log(archive, 'hello')
            //   index[link] = archive;
            //   // console.log(archive);
            // });
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
            const currPage = data.serpapi_pagination.current
            // console.log(data.organic_results?.slice(-1)[0].position);
            // console.log(data)
            const totalPages = ((data.search_information.total_results / (request.engine === 'google' ? 100 : 50)) + 1).toFixed()
            console.log(currPage, totalPages)
            obj.info = {
              currentPage: currPage,
              totalPages: totalPages === NaN ? 'N/A' : totalPages,
              dmca: data.dmca_messages,
            };
            return res.json({ results: obj, recentQueries });
          }
        });
      };

      await results(response);
    } else {
      res.json({ message: "End of results" }).status(200);
    }

  };

  // console.log(final);
  // delete params.string
  const request = {
    // start_addr: `${lat},${lng}`,
    // end_addr: "hebron train station",
    // engine: "google_maps_directions",
    ...params,
    num: 100,
    q: `${params.q ? params.q : ""}${params.string ? " " + params.string : ""}`,
    filter: 0
    // ll:`@${lat},${lng}`
    // device: "tablet",
    // travel_mode: 3,
  };
  if (params.engine === 'bing') {
    const first = params.start
    delete request.num
    delete request.start
    request.first = first
    request.count = 50
  }
  console.log(request);
  try {
    await search.json(request, callback);
  } catch (error) {
    console.log(error);
  }
});

router.get("/queries/recent", async (req, res) => {
  const { user } = req;
  if (user) {
    const recentQueries = await Queries.findAll({
      where: {
        userId: user.id,
      },
      order: [["updatedAt", "DESC"]],
      limit: 5,
    });

    return res.json(recentQueries).status(200);
  }
});

module.exports = router;
