
const router = require('express').Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const dorkRouter = require('./dork.js')
const resultRouter = require('./result.js')
const queryRouter = require('./queries.js')
const archiveRouter = require('./archive.js')
const chatgptRouter = require('./chatgpt.js')
const resourceGroupRouter = require('./resourceGroups.js')
const { setTokenCookie } = require('../../utils/auth.js');
const { User, Queries } = require('../../db/models');
const { restoreUser } = require('../../utils/auth.js');
const { requireAuth } = require('../../utils/auth.js');

router.use(restoreUser);

router.use('/session', sessionRouter);

router.use('/users', usersRouter);

router.use('/dork', dorkRouter);

router.use('/results', resultRouter)

router.use('/queries', queryRouter)

router.use('/archive', archiveRouter)

router.use('/chatgpt', chatgptRouter)

router.use('/resourcegroups', resourceGroupRouter)

router.get(
  '/restore-user',
  async (req, res) => {
    // const recentQueries = await Queries.findAll({
    //   where: {
    //     userId : user.id,
    //   },
    //   sort: ['createdAt', 'Ascending'],
    //   limit: 10
    // })
    return res.json(req.user);
  }
);

module.exports = router;
