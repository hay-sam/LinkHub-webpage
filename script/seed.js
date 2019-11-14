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
    Post.create({url: 'https://httpstatusdogs.com/201-created'}),
    Post.create({url: 'https://httpstatusdogs.com/100-continue'}),
    Post.create({url: 'https://httpstatusdogs.com/202-accepted'}),
    Post.create({
      url: 'https://httpstatusdogs.com/203-non-authoritative-information'
    }),
    Post.create({url: 'https://httpstatusdogs.com/204-no-content'}),
    Post.create({url: 'https://httpstatusdogs.com/206-partial-content'}),
    Post.create({url: 'https://httpstatusdogs.com/207-multi-status'})
  ])

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
