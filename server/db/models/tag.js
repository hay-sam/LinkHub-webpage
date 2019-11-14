const Sequelize = require('sequelize')
const db = require('../db')

const Tag = db.define('tag', {
  content: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true
    }
  }
})

module.exports = Tag
