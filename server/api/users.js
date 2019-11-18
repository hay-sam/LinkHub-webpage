const router = require('express').Router()

const {User, Post, Tag} = require('../db/models')
module.exports = router

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

router.put('/:userId/posts/:postId', async (req, res, next) => {
  try {
    let post = await Post.findByPk(req.params.postId)
    let postNew = await post.update(
      {title: req.body.title, description: req.body.description},
      {fields: ['title', 'description']}
    )
    postNew = await postNew.save()
    let tagsArr = await Promise.all(
      req.body.tags.map(async tag => {
        let theTag = await Tag.findOrCreate({where: {content: tag}})
        return theTag[0]
      })
    )
    await postNew.setTags(tagsArr)
    let withTags = await Post.findByPk(req.params.postId, {
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
