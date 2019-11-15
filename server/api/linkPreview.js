const router = require('express').Router()
const LinkPreview = require('link-preview-js')
module.exports = router

router.post('/', async (req, res, next) => {
  try {
    const preview = await LinkPreview.getPreview(req.body.url)
    res.status(201).send(preview)
  } catch (err) {
    console.error(err)
    next(err)
  }
})
