import React from 'react'
import {connect} from 'react-redux'
import {getPosts} from '../store/posts'

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

export default connect(mapStateToProps, mapDispatchToProps)(Posts)
