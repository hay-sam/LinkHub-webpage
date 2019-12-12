const router = require('express').Router()

const {User, Post, Tag} = require('../db/models')
module.exports = router

// Authentication Middleware Only a user can retrieve their own information in an API call
// Applied to all sensitive routes
const isMe = (req, res, next) => {
  if (Number(req.user.id) === Number(req.params.userId)) {
    next()
  } else {
    res.status(403).send("You're not Authorized to do that...")
  }
}

// Get all of a user's tags
router.get('/:userId/tags', isMe, async (req, res, next) => {
  const user = await User.findByPk(req.params.userId)
  const info = await user.getAllTags()
  const infoObj = {}
  info.forEach(tag => {
    infoObj[tag.id] = tag
  })
  res.status(200).send(Object.values(infoObj))
})

// Retrieve all of a user's posts, with their tags
router.get('/:userId/posts', isMe, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.userId)
    const posts = await user.getPosts({include: [{model: Tag}]})
    res.status(200).send(posts)
  } catch (err) {
    console.error(err)
    next(err)
  }
})

// Create a new post with tags for a given user
router.post('/:userId/posts', isMe, async (req, res, next) => {
  try {
    const post = await Post.create({
      url: req.body.url,
      userId: req.params.userId
    })
    // Convert array of tag strings into array of tag sequelize instances so they can be assigned to post
    let tagsArr = await Promise.all(
      req.body.tags.map(async tag => {
        let theTag = await Tag.findOrCreate({where: {content: tag}}) // No dupilicate tag values
        return theTag[0]
      })
    )
    await post.setTags(tagsArr) // Assign tags to Post
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

// Updata a post's title, description and tags.
router.put('/:userId/posts/:postId', isMe, async (req, res, next) => {
  try {
    let post = await Post.findByPk(req.params.postId) // Update fields on Post attribute
    if (post.userId !== req.user.id)
      res.status(403).send("You're not Authorized to do that...")
    let postNew = await post.update(
      {title: req.body.title, description: req.body.description},
      {fields: ['title', 'description']}
    )
    postNew = await postNew.save()
    let tagsArr = await Promise.all(
      // All post tags are sent in req.body when updating, can add/remove tags
      req.body.tags.map(async tag => {
        let theTag = await Tag.findOrCreate({where: {content: tag}})
        return theTag[0]
      })
    )
    await postNew.setTags(tagsArr) // Reassign post's tags in postTags through table
    let withTags = await Post.findByPk(req.params.postId, {
      include: [{model: Tag}]
    })
    res.status(201).send(withTags)
  } catch (err) {
    console.error(err)
    next(err)
  }
})

// Delete post
router.delete('/:userId/posts/:postId', isMe, async (req, res, next) => {
  try {
    const post = await Post.findByPk(req.params.postId)
    if (post.userId !== req.user.id)
      res.status(403).send("You're not Authorized to do that...")
    await post.setTags([]) // Remove all tags for a post from the through postTags through table
    await post.destroy() // Remove post from posts table
    res.sendStatus(201)
  } catch (err) {
    console.error(err)
    next(err)
  }
})
