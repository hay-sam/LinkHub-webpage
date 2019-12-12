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

  describe('/api/users/:userid/posts', () => {
    const codysEmail = 'cody@email.com'
    const murphysEmail = 'murphy@email.com'

    beforeEach(async () => {
      await User.create({
        email: codysEmail,
        password: '123'
      })
      await User.create({
        email: murphysEmail,
        password: '123'
      })
    })
    describe('POST /api/users/:userId/posts', () => {
      beforeEach(async () => {
        await agent
          .post('/auth/login')
          .send({email: 'cody@email.com', password: '123'})
      })

      it('creates a new post for the user', async () => {
        const res = await agent
          .post('/api/users/1/posts')
          .send({
            url: 'https://podium--app.herokuapp.com/',
            tags: []
          })
          .expect(201)

        expect(res.body).to.be.an('object')
        expect(res.body.title).to.be.equal('Podium')
      })
      it('will create the post with associated tags', async () => {
        const res = await agent
          .post('/api/users/1/posts')
          .send({
            url: 'https://podium--app.herokuapp.com/',
            tags: ['important', 'project', 'cool', 'public speaking']
          })
          .expect(201)

        expect(res.body).to.be.an('object')
        expect(res.body.title).to.be.equal('Podium')
        expect(res.body.tags).to.be.an('array')
        expect(res.body.tags.length).to.be.equal(4)
      })
      it('will not create a post for a not authorized user', async () => {
        await agent
          .post('/api/users/2/posts')
          .send({
            url: 'https://podium--app.herokuapp.com/',
            tags: ['important', 'project', 'cool', 'public speaking']
          })
          .expect(403)
      })
    })
    describe('GET /api/users/:userId/posts', () => {
      beforeEach(async () => {
        await agent
          .post('/auth/login')
          .send({email: 'cody@email.com', password: '123'})
        await agent.post('/api/users/1/posts').send({
          url: 'https://podium--app.herokuapp.com/',
          tags: ['a', 'post']
        })
        await agent.post('/api/users/1/posts').send({
          url: 'https://link--hub.herokuapp.com/posts/#',
          tags: ['cool', 'project', 'wow', 'post']
        })
        await agent.post('/api/users/1/posts').send({
          url:
            'https://www.averiecooks.com/softbatch-no-roll-holiday-sprinkles-cookies/',
          tags: []
        })
        await agent.post('/api/users/1/posts').send({
          url: 'https://coolors.co/5a9367-5cab7d-4adbc8-514f59-1d1128',
          tags: ['wow', 'colors']
        })
      })

      it("returns a an array of a user's posts", async () => {
        const res = await agent.get('/api/users/1/posts').expect(200)

        expect(res.body).to.be.an('array')
        expect(res.body.length).to.be.equal(4)
      })
      it('all posts include the tag model', async () => {
        const res = await agent.get('/api/users/1/posts').expect(200)

        expect(res.body).to.be.an('array')
        expect(res.body[0].tags).to.be.an('array')
        expect(res.body[0].tags.length).to.be.equals(2)
      })
      it('will not return posts for not authorized user', async () => {
        await agent.get('/api/users/2/tags').expect(403)
      })
    })

    describe('GET /api/users/:userId/tags', () => {
      beforeEach(async () => {
        await agent
          .post('/auth/login')
          .send({email: 'cody@email.com', password: '123'})
        await agent.post('/api/users/1/posts').send({
          url: 'https://podium--app.herokuapp.com/',
          tags: ['a', 'post']
        })
        await agent.post('/api/users/1/posts').send({
          url: 'https://link--hub.herokuapp.com/posts/#',
          tags: ['cool', 'project', 'wow', 'post']
        })
        await agent.post('/api/users/1/posts').send({
          url:
            'https://www.averiecooks.com/softbatch-no-roll-holiday-sprinkles-cookies/',
          tags: ['tags']
        })
        await agent.post('/api/users/1/posts').send({
          url: 'https://coolors.co/5a9367-5cab7d-4adbc8-514f59-1d1128',
          tags: ['wow', 'colors', 'tags']
        })
      })

      it("returns a an array with a user's tags", async () => {
        const res = await agent.get('/api/users/1/tags').expect(200)

        expect(res.body).to.be.an('array')
        expect(res.body.length).to.be.equal(7)
      })
      it('contains only unique values', async () => {
        const res = await agent.get('/api/users/1/tags').expect(200)
        let unique = new Set(res.body)
        expect(res.body).to.be.an('array')
        expect(res.body.length).to.be.equal(7)
        expect(res.body.length).to.be.equal(unique.size)
      })
      it('will not return the tags for a not the signed in user', async () => {
        await agent.get('/api/users/2/tags').expect(403)
      })
    })
  }) // end describe('/api/users/:userId/posts')
  describe('/api/users/:userid/tags', () => {
    const codysEmail = 'cody@email.com'
    const murphysEmail = 'murphy@email.com'

    beforeEach(async () => {
      await User.create({
        email: codysEmail,
        password: '123'
      })
      await User.create({
        email: murphysEmail,
        password: '123'
      })
    })
    describe('GET /api/users/:userId/tags', () => {
      beforeEach(async () => {
        await agent
          .post('/auth/login')
          .send({email: 'cody@email.com', password: '123'})
        await agent.post('/api/users/1/posts').send({
          url: 'https://podium--app.herokuapp.com/',
          tags: ['a', 'post']
        })
        await agent.post('/api/users/1/posts').send({
          url: 'https://link--hub.herokuapp.com/posts/#',
          tags: ['cool', 'project', 'wow', 'post']
        })
        await agent.post('/api/users/1/posts').send({
          url:
            'https://www.averiecooks.com/softbatch-no-roll-holiday-sprinkles-cookies/',
          tags: ['tags']
        })
        await agent.post('/api/users/1/posts').send({
          url: 'https://coolors.co/5a9367-5cab7d-4adbc8-514f59-1d1128',
          tags: ['wow', 'colors', 'tags']
        })
      })

      it("returns a an array with a user's tags", async () => {
        const res = await agent.get('/api/users/1/tags').expect(200)

        expect(res.body).to.be.an('array')
        expect(res.body.length).to.be.equal(7)
      })
      it('contains only unique values', async () => {
        const res = await agent.get('/api/users/1/tags').expect(200)
        let unique = new Set(res.body)
        expect(res.body).to.be.an('array')
        expect(res.body.length).to.be.equal(7)
        expect(res.body.length).to.be.equal(unique.size)
      })
      it('will not return the tags for a not the signed in user', async () => {
        await agent.get('/api/users/2/tags').expect(403)
      })
    })
  }) // end describe('/api/users/:userId/tags')
}) // end describe('User routes')
