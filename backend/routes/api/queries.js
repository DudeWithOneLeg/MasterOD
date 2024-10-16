const express = require("express");
const router = express.Router();
const { Queries } = require("../../db/models");
const { Op } = require("@sequelize/core");

router.post("/", async (req, res) => {
    const { user } = req;
    const { limit, filter, saved, engine } = req.body;
    console.log(engine)
    const options = {
        where: {
            userId: user.id,
        },
        order: [["updatedAt", "DESC"]],
        limit,
    };

    if (filter) {
        options.where = {
            userId: user.id,
            [Op.or]: [
                { query: { [Op.like]: `%${filter}%` } },
                { string: { [Op.like]: `%${filter}%` } },
            ],
        };
    }

    if (engine) {
        options.where.engine = engine;
    } else {
        if (!options.where[Op.or]) {
            options.where[Op.or] = [];
        }

        options.where[Op.or].push({ engine: { [Op.like]: `%${filter}%` } });
    }

    if (saved) {
        options.where.saved = true;
    }

    const queries = await Queries.findAll(options);

    return res.json(queries).status(200);
});

router.get("/save", async (req, res) => {
    const { user } = req;

    const savedQueries = await Queries.findAll({
        where: {
            userId: user.id,
            saved: true,
        },
        order: [["createdAt", "DESC"]],
        limit: 5,
    });

    return res.json(savedQueries).status(200);
});

router.post("/save", async (req, res) => {
    const params = req.body;
    const { user } = req;
    params.q = params.q
        .split(";")
        .map((q) =>
            q.includes(":") ? `${q.split(":")[0]}:"${q.split(":")[1]}"` : ""
        )
        .join(" ");

    const newQuery = {
        userId: user.id,
        query: params.q,
        engine: params.engine,
        saved: true,
        string: params.string,
    };

    await Queries.create(newQuery);
    const recentSavedQueries = await Queries.findAll({
        where: {
            userId: user.id,
            saved: true,
        },
        order: [["createdAt", "DESC"]],
        limit: 5,
    });

    res.statusCode = 200;
    return res.json(recentSavedQueries).status(200);
});

router.post("/:queryId", async (req, res) => {
    const { queryId } = req.params;

    const query = await Queries.findByPk(queryId);
    query.update({
        saved: !query.saved,
    });
    return res.json(query).status(200);
});

module.exports = router;
