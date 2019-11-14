const User = require('./user')
const Tag = require('./tag')
const Post = require('./post')

User.hasMany(Post)
Post.belongsTo(User)
Tag.belongsToMany(Post, {through: 'postTags'})
Post.belongsToMany(Tag, {through: 'postTags'})

module.exports = {
  User,
  Tag,
  Post
}
