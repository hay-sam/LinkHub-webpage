'use strict'

const db = require('../server/db')
const {User, Post, Tag} = require('../server/db/models')

async function seed() {
  await db.sync({force: true})
  console.log('db synced!')

  const users = await Promise.all([
    User.create({email: 'cody@email.com', password: '123'}),
    User.create({email: 'murphy@email.com', password: '123'})
  ])
  const tags = await Promise.all([
    Tag.create({content: 'tag1'}),
    Tag.create({content: 'tag2'}),
    Tag.create({content: 'tag3'}),
    Tag.create({content: 'tag4'}),
    Tag.create({content: 'tag5'})
  ])

  const posts = await Promise.all([
    Post.create({url: 'https://httpstatusdogs.com/201-created', userId: 1}),
    Post.create({url: 'https://httpstatusdogs.com/100-continue', userId: 2}),
    Post.create({url: 'https://httpstatusdogs.com/202-accepted', userId: 2}),
    Post.create({
      url: 'https://httpstatusdogs.com/203-non-authoritative-information',
      userId: 1
    }),
    Post.create({url: 'https://httpstatusdogs.com/204-no-content', userId: 1}),
    Post.create({
      url: 'https://httpstatusdogs.com/206-partial-content',
      userId: 2
    }),
    Post.create({url: 'https://httpstatusdogs.com/207-multi-status', userId: 1})
  ])

  await Promise.all([
    posts[0].addTag(tags[0]),
    posts[1].addTags([tags[1], tags[2]]),
    posts[2].addTags([tags[1], tags[4], tags[2], tags[3]]),
    posts[3].addTags([tags[1], tags[3], tags[0], tags[2]]),
    posts[4].addTags([tags[0], tags[2], tags[4]]),
    posts[5].addTags([tags[1], tags[4], tags[0], tags[2], tags[3]])
  ])
  // const info = await users[0].getAllTags()
  // const infoObj = {}
  // info.forEach(tag=>{infoObj[tag.id]= tag.content})
  // console.log(Object.entries(infoObj))
  console.log(
    `seeded ${users.length} users, ${tags.length} tags, and ${
      posts.length
    } posts`
  )
  console.log(`seeded successfully`)
}

// We've separated the `seed` function from the `runSeed` function.
// This way we can isolate the error handling and exit trapping.
// The `seed` function is concerned only with modifying the database.
async function runSeed() {
  console.log('seeding...')
  try {
    await seed()
  } catch (err) {
    console.error(err)
    process.exitCode = 1
  } finally {
    console.log('closing db connection')
    await db.close()
    console.log('db connection closed')
  }
}

// Execute the `seed` function, IF we ran this module directly (`node seed`).
// `Async` functions always return a promise, so we can use `catch` to handle
// any errors that might occur inside of `seed`.
if (module === require.main) {
  runSeed()
}

// we export the seed function for testing purposes (see `./seed.spec.js`)
module.exports = seed
