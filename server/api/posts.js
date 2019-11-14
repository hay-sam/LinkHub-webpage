const router = require('express').Router()
const {User, Post, Tag} = require('../db/models')
module.exports = router

router.get('/', async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.userId)
    const posts = await user.getPosts({include: [{model: Tag}]})
    res.status(200).send(posts)
  } catch (err) {
    console.error(err)
    next(err)
  }
})

router.post('/', async (req, res, next) => {
  try {
    const post = await Post.create({url: req.body.url})
    let tags = req.body.tags
    tags = await tags.map(async tag => {
      await Tag.findOrCreate({where: {content: tag}})
    })
    await post.addTags(tags)
    res.sendStatus(201)
  } catch (err) {
    console.error(err)
    next(err)
  }
})

router.get('/:postId', async (req, res, next) => {
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

router.delete('/:postId', async (req, res, next) => {
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

router.get('/:postId/tags', async (req, res, next) => {
  try {
    const post = await Post.findByPk(req.params.postId)
    let tags = await post.getTags()
    res.status(201).send(tags)
  } catch (err) {
    console.error(err)
    next(err)
  }
})

router.post('/:postId/tags', async (req, res, next) => {
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

router.delete('/:postId/tags/:tagId', async (req, res, next) => {
  try {
    const post = await Post.findByPk(req.params.postId)
    let tag = await Tag.findOne({where: {content: tag}})
    post.removeTag(tag)
    res.sendStatus(201)
  } catch (err) {
    console.error(err)
    next(err)
  }
})
