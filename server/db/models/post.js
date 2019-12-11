const Sequelize = require('sequelize')
const db = require('../db')
const LinkPreview = require('link-preview-js')

const Post = db.define('post', {
  url: {
    //link URL
    type: Sequelize.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true,
      isUrl: true
    }
  },
  image: {
    // Url of image preview
    type: Sequelize.TEXT,
    defaultValue:
      'https://cdn1-www.dogtime.com/assets/uploads/2011/03/puppy-development.jpg'
  },
  description: {
    // Page descriptin
    type: Sequelize.TEXT,
    defaultValue: "Hmm this page doesn't have a description"
  },
  title: {
    // Page title
    type: Sequelize.STRING,
    defaultValue: 'I am the title'
  },
  contentType: {
    // MIME type of page
    type: Sequelize.STRING
  }
})

// Sequelize Hook runs before creation of new post
Post.beforeCreate(post => {
  return LinkPreview.getPreview(post.url).then(preview => {
    // Scrape the website to get key information, then assign to instance attributes
    post.contentType = preview.contentType
    if (preview.images) post.image = preview.images[0]
    else if (preview.contentType === 'image/jpeg') post.image = post.url
    if (preview.title) post.title = preview.title
    if (preview.description) post.description = preview.description
  })
})

module.exports = Post
