const router = require('express').Router()

const {User, Post, Tag} = require('../db/models')
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

router.get('/:userId/posts', async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.userId)
    const posts = await user.getPosts({include: [{model: Tag}]})
    res.status(200).send(posts)
  } catch (err) {
    console.error(err)
    next(err)
  }
})

router.post('/:userId/posts', async (req, res, next) => {
  try {
    const post = await Post.create({
      url: req.body.url,
      userId: req.params.userId
    })
    let tagsArr = await Promise.all(
      req.body.tags.map(async tag => {
        let theTag = await Tag.findOrCreate({where: {content: tag}})
        return theTag[0]
      })
    )
    await post.setTags(tagsArr)
    let withTags = await Post.findOne({
      where: {url: req.body.url, userId: req.params.userId},
      include: [{model: Tag}]
    })
    res.status(201).send(withTags)
  } catch (err) {
    console.error(err)
    next(err)
  }
})

router.get('/:userId/posts/:postId', async (req, res, next) => {
  try {
    const post = await Post.findByPk(req.params.postId, {
      include: [{model: Tag}]
    })
    res.status(201).send(post)
  } catch (err) {
    console.error(err)
    next(err)
  }
})

router.put('/:userId/posts/:postId', async (req, res, next) => {
  try {
    const post = await Post.findByPk(req.params.postId)
    post.update({title: req.body.title, description: req.body.description})
    let tagsArr = await Promise.all(
      req.body.tags.map(async tag => {
        let theTag = await Tag.findOrCreate({where: {content: tag}})
        return theTag[0]
      })
    )
    await post.setTags(tagsArr)
    let withTags = await Post.findOne({
      where: {url: req.body.url, userId: req.params.userId},
      include: [{model: Tag}]
    })
    res.status(201).send(withTags)
  } catch (err) {
    console.error(err)
    next(err)
  }
})

router.delete('/:userId/posts/:postId', async (req, res, next) => {
  try {
    const post = await Post.findByPk(req.params.postId)
    await post.setTags([])
    await post.destroy()
    res.sendStatus(201)
  } catch (err) {
    console.error(err)
    next(err)
  }
})

router.get('/:userId/posts/:postId/tags', async (req, res, next) => {
  try {
    const post = await Post.findByPk(req.params.postId)
    let tags = await post.getTags()
    res.status(201).send(tags)
  } catch (err) {
    console.error(err)
    next(err)
  }
})

router.post('/:userId/posts/:postId/tags', async (req, res, next) => {
  try {
    const post = await Post.findByPk(req.params.postId)
    let tags = await req.body.tags.map(async tag => {
      await Tag.findOne({where: {content: tag}})
    })
    post.addTags(tags)
    res.sendStatus(201)
  } catch (err) {
    console.error(err)
    next(err)
  }
})

router.delete('/:userId/posts/:postId/tags/:tagId', async (req, res, next) => {
  try {
    const post = await Post.findByPk(req.params.postId)
    let tag = await Tag.findByPk(req.params.tagId)
    post.removeTag(tag)
    res.sendStatus(201)
  } catch (err) {
    console.error(err)
    next(err)
  }
})
