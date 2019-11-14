const Sequelize = require('sequelize')
const db = require('../db')

const Post = db.define('post', {
  url: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      isUrl: true
    }
  }
})

module.exports = Post
