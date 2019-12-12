/* global describe beforeEach it */

const {expect} = require('chai')
const supertest = require('supertest')
const db = require('../db')
const app = require('../index')
const agent = supertest.agent(app)
const User = db.model('user')
const Post = db.model('post')

describe('User routes', () => {
  beforeEach(() => {
    return db.sync({force: true})
  })

  describe('/api/users/:userid/', () => {
    const codysEmail = 'cody@email.com'
    const murphysEmail = 'cody@email.com'

    beforeEach(async () => {
      await User.create({
        email: codysEmail,
        password: '123'
      })
      await User.create({
        email: murphysEmail,
        password: '123'
      })
      await Post.create({
        url: 'https://podium--app.herokuapp.com/',
        tags: ['important', 'project', 'cool', 'public speaking'],
        userId: 1
      })
      await Post.create({
        url: 'https://podium--app.herokuapp.com/',
        tags: ['these', 'are', 'different', 'tags'],
        userId: 2
      })
    })
    describe('GET /api/users/:userId/tags', () => {
      beforeEach(async () => {
        await agent
          .post('/auth/login')
          .send({email: 'cody@email.com', password: '123'})
      })

      it("returns a an array with a user's tags", async () => {
        const res = await agent.get('/api/users/1/tags').expect(200)

        expect(res.body).to.be.an('array')
        expect(res.body.length).to.be.equal(4)
      })
      it("contains tags from all of a user's posts", async () => {
        await Post.create({
          url: 'https://podium--app.herokuapp.com/',
          tags: ['new', 'tags'],
          userId: 1
        })
        const res = await agent.get('/api/users/1/tags').expect(200)

        expect(res.body).to.be.an('array')
        expect(res.body.length).to.be.equal(6)
      })
      it('contains only unique values', async () => {
        await Post.create({
          url: 'https://podium--app.herokuapp.com/',
          tags: ['important', 'cool'],
          userId: 1
        })
        const res = await agent.get('/api/users/1/tags').expect(200)

        expect(res.body).to.be.an('array')
        expect(res.body.length).to.be.equal(4)
      })
      it('will not return the tags for a not the signed in user', async () => {
        await agent.get('/api/users/1/tags').expect(403)
      })
    })
  }) // end describe('/api/users')
}) // end describe('User routes')
