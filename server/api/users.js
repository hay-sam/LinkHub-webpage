const router = require('express').Router()
const {User} = require('../db/models')
module.exports = router

router.get('/', async (req, res, next) => {
  try {
    const users = await User.findAll({
      // explicitly select only the id and email fields - even though
      // users' passwords are encrypted, it won't help if we just
      // send everything to anyone who asks!
      attributes: ['id', 'email']
    })
    res.json(users)
  } catch (err) {
    next(err)
  }
})

router.get('/:userId/tags', async (req, res, next) => {
  const user = await User.findByPk(req.params.userId)
  const info = await user.getAllTags()
  const infoObj = {}
  info.forEach(tag => {
    infoObj[tag.id] = tag
  })
  res.status(200).send(Object.values(infoObj))
})

router.use('/:userId/posts', require('./posts'))
