import React from 'react'
import {connect} from 'react-redux'
import {getPosts} from '../store/posts'
import {withRouter} from 'react-router-dom'

import PostItem from './post-item'

import Card from 'react-bootstrap/Card'

class Posts extends React.Component {
  constructor(props) {
    super(props)
  }
  componentDidMount() {
    this.props.getPosts(this.props.userId)
  }
  render() {
    let {posts} = this.props
    if (this.props.match.params.tagContent) {
      posts = posts.filter(post => {
        return post.tags.some(tag => {
          return tag.content === this.props.match.params.tagContent
        })
      })
    }
    return (
      <div className="all-posts">
        {posts.map(post => (
          <PostItem post={post} key={post.id} className="post-item" />
        ))}
      </div>
    )
  }
}

const mapStateToProps = state => ({
  userId: state.user.id,
  posts: state.posts
})

const mapDispatchToProps = dispatch => ({
  getPosts: id => dispatch(getPosts(id))
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Posts))
