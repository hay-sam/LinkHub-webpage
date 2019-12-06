import React from 'react'
import {connect} from 'react-redux'
import {getPosts} from '../store/posts'
import {withRouter, Link} from 'react-router-dom'
import PostItem from './post-item'
import Fab from '@material-ui/core/Fab'
import AddIcon from '@material-ui/icons/Add'
import AddPost from './add-post'
import PropTypes from 'prop-types'

const style = {
  margin: 0,
  top: 'auto',
  right: 20,
  bottom: 20,
  left: 'auto',
  position: 'fixed'
}
class Posts extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      open: false
    }
    this.handleClickOpen = this.handleClickOpen.bind(this)
    this.handleClose = this.handleClose.bind(this)
  }
  componentDidMount() {
    this.props.getPosts(this.props.userId)
  }
  handleClickOpen() {
    this.setState({open: true})
  }
  handleClose() {
    this.setState({open: false})
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
        {posts.length > 0 ? (
          posts.map(post => (
            <PostItem post={post} key={post.id} className="post-item" />
          ))
        ) : (
          <div style={{textAlign: 'center'}}>
            <h3>Hmm... no posts found matching that tag</h3>
            <h4>
              Click <Link to="/posts">HERE</Link> to view all posts!
            </h4>
          </div>
        )}

        <Fab
          color="primary"
          aria-label="add"
          style={style}
          onClick={this.handleClickOpen}
        >
          <AddIcon />
        </Fab>
        <AddPost
          open={this.state.open}
          handleClickOpen={this.handleClickOpen}
          handleClose={this.handleClose}
        />
      </div>
    )
  }
}

const mapStateToProps = state => ({
  userId: state.user.id,
  posts: state.posts,
  tags: state.tags
})

const mapDispatchToProps = dispatch => ({
  getPosts: id => dispatch(getPosts(id))
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Posts))

Posts.propTypes = {
  posts: PropTypes.array.isRequired
}
