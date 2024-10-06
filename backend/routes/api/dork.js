const express = require("express");
const router = express.Router();
const SerpApi = require("google-search-results-nodejs");
require("dotenv").config();
const SERP_API_ACCESS_KEY = process.env.SERP_API_ACCESS_KEY;
const search = new SerpApi.GoogleSearch(SERP_API_ACCESS_KEY);
const OpenAI = require("openai");
const apiKey = process.env.OPENAI_API_KEY;
const ogs = require('open-graph-scraper');
const openai = new OpenAI({
    apiKey,
});
const { Queries, Result } = require("../../db/models");
const prompt = `
You are a master google "dork" researcher.
I will give you a prompt and you will respond with the most detailed
targeted "dork" to get the most relevant results.
Only respond with the dork string.

Examples:
{prompt: The effect of school shootings on young adults, response: ""effect of school shootings" AND "young adults" AND (report OR study OR research OR article) site:.edu OR site:.gov OR site:.org
"}
{prompt: "Open directories with books on cyber security", response: "intitle:"index of" "cyber security" (pdf OR epub OR mobi) -html -htm -php -asp
"}

 the new prompt is `;
const query = {
    groups: [{}, {}],
};

router.post("/iframe/", async (req, res) => {
    const { link, title, snippet, queryId } = req.body;
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

        return res.json({ data: "" });
    }
});

router.post("/", async (req, res) => {
    const params = req.body;
    const { user } = req;

    console.log(params);
    if (!params.gpt) {
        params.q = params.q
            .split(";")
            .map((q) =>
                q.includes(":")
                    ? !q.includes("site") && !q.includes("inurl")
                        ? `${q.split(":")[0]}:"${q.split(":")[1]}"`
                        : `${q.split(":")[0]}:${q.split(":")[1]}`
                    : ""
            )
            .join(" ");
        const newQuery = {
            userId: user.id,
            query: params.q,
            engine: params.engine,
            string: params.string,
        };
        if (params.start === 0) {
            await Queries.create(newQuery);
        }
    }

    const recentQueries = await Queries.findAll({
        where: {
            userId: user.id,
        },
        order: [["updatedAt", "DESC"]],
        limit: 5,
    });

    const obj = {};
    const callback = async (data) => {
        const response = data.organic_results;
        if (data.organic_results) {
            const results = async (rest) => {
                const index = {};
                Object.values(rest).forEach(async (resp) => {
                    const link = resp.link;
                    console.log(resp)
                    if (!index[link]) {
                        obj[resp.position] = {
                            id: resp.position,
                            title: resp.title,
                            link: resp.link,
                            snippet: resp.snippet,
                        };
                    } else {
                        obj[resp.position] = {
                            id: resp.position,
                            title: resp.title,
                            link: resp.link,
                            snippet: resp.snippet,
                            archive: index[link],
                        };
                    }

                    if (
                        Object.values(obj).length ==
                        Object.values(response).length
                    ) {
                        const currPage =
                            data.serpapi_pagination &&
                                data.serpapi_pagination.current
                                ? data.serpapi_pagination.current
                                : 0;
                        // console.log(data.organic_results?.slice(-1)[0].position);
                        // console.log(data);
                        const totalPages = (
                            data.search_information.total_results /
                            (request.engine === "google" ? 100 : 50) +
                            1
                        ).toFixed();
                        console.log(currPage, totalPages);
                        // console.log(Object.values(obj).slice(0, -1)[0]);
                        // for (const result of Object.values(obj)) {
                        //     const url = obj[result.id].link
                        //     const options = { url };
                        //     const data = await ogs(options).catch((err) => {
                        //         console.log(err);
                        //     });
                        //     if (data && !data.error && data.result && data.result.ogImage && data.result.ogImage.length) {
                        //         console.log(data.result.ogImage);
                        //     }
                        //     // console.log('error:', error);  // This returns true or false. True if there was an error. The error itself is inside the result object.
                        //                 // console.log('html:', html); // This contains the HTML of page
                        //     // console.log('result:', result); // This contains all of the Open Graph results
                        //     // console.log('response:', response); // This contains response from the Fetch API
                        // }
                        obj.info = {
                            currentPage: currPage,
                            totalPages: totalPages === NaN ? "N/A" : totalPages,
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
    let request = {
        // start_addr: `${lat},${lng}`,
        // end_addr: "hebron train station",
        // engine: "google_maps_directions",
        num: 100,
        filter: 0,
        // ll:`@${lat},${lng}`
        // device: "tablet",
        // travel_mode: 3,
    };

    if (!params.gpt) {
        request = {
            ...request,
            ...params,
            q: `${params.q ? params.q : ""}${params.string ? " " + params.string : ""
                }`,
        };
    } else {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: `${prompt} "${params.q}"` }],
            stream: false,
        });

        const content = completion.choices[0].message.content;

        request.q = content;
    }

    if (params.engine === "bing") {
        const first = params.start;
        delete request.num;
        delete request.start;
        request.first = first;
        request.count = 50;
        if (params.location) {
            const location = params.location;
            request.q = request.q + ` location:${location}`;
            delete request.location;
        }
        if (params.hl) {
            const language = params.hl;
            request.q = request.q + ` language:${language}`;
            delete request.hl;
        }
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
