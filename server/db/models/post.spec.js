const {expect} = require('chai')
const db = require('../index')
const Post = db.model('post')

describe('Post model', () => {
  beforeEach(() => {
    return db.sync({force: true})
  })

  describe('Hooks', () => {
    describe('beforeCreate', () => {
      it('runs link-preview-js to scrape the url for information', async () => {
        let post = await Post.create({url: 'https://link--hub.herokuapp.com/'})
        expect(post.title).to.be.equal('LinkHub')
        expect(post.description).to.be.equal(
          'Save links from all across the web in your own personal Link Hub'
        )
      })
    })
  })
})
