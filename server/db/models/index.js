const User = require('./user')
const Tag = require('./tag')
const Post = require('./post')

// Associations between models

User.hasMany(Post) //Users have posts
Tag.belongsToMany(Post, {through: 'postTags'}) // Required to give many to many through table a name
Post.belongsToMany(Tag, {through: 'postTags'}) // model1.belongsToMany(model2) creates magic methods according to sequelize documentation https://sequelize.org/master/manual/associations.html#belongs-to-many-associations

module.exports = {
  User,
  Tag,
  Post
}
