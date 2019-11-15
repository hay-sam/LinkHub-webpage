const Sequelize = require('sequelize')
const db = require('../db')
const LinkPreview = require('link-preview-js')

const Post = db.define('post', {
  url: {
    type: Sequelize.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true,
      isUrl: true
    }
  },
  image: {
    type: Sequelize.TEXT,
    defaultValue:
      'https://cdn1-www.dogtime.com/assets/uploads/2011/03/puppy-development.jpg'
  },
  description: {
    type: Sequelize.TEXT,
    defaultValue: "Hmm this page doesn't have a description"
  },
  title: {
    type: Sequelize.STRING,
    defaultValue: 'I am the title'
  },
  contentType: {
    type: Sequelize.STRING
  }
})

Post.beforeValidate(post => {
  return LinkPreview.getPreview(post.url).then(preview => {
    post.contentType = preview.contentType
    if (preview.images) post.image = preview.images[0]
    else if (preview.contentType === 'image/jpeg') post.image = post.url
    if (preview.title) post.title = preview.title
    if (preview.description) post.description = preview.description
  })
})

module.exports = Post
