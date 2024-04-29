
const router = require('express').Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const dorkRouter = require('./dork.js')
const resultRouter = require('./result.js')
const { setTokenCookie } = require('../../utils/auth.js');
const { User, Queries } = require('../../db/models');
const { restoreUser } = require('../../utils/auth.js');
const { requireAuth } = require('../../utils/auth.js');

router.use(restoreUser);

router.use('/session', sessionRouter);

router.use('/users', usersRouter);

router.use('/dork', dorkRouter);

router.use('/results', resultRouter)

router.get(
  '/restore-user',
  async (req, res) => {
    const recentQueries = await Queries.findAll({
      where: {
        userId : user.id,
      },
      sort: ['createdAt', 'Ascending'],
      limit: 10
    })
    return res.json(req.user);
  }
);

module.exports = router;
