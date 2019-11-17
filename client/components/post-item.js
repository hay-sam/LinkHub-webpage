import React from 'react'
import {connect} from 'react-redux'
import Card from 'react-bootstrap/Card'
import {Link} from 'react-router-dom'
import IconButton from '@material-ui/core/IconButton'
import TagIcon from '@material-ui/icons/LocalOffer'
import EditIcon from '@material-ui/icons/Edit'
import DeleteIcon from '@material-ui/icons/Delete'
import LinkIcon from '@material-ui/icons/Link'
import EditPost from './edit-post'
import copy from 'copy-to-clipboard'
import CloseIcon from '@material-ui/icons/Close'
import Snackbar from '@material-ui/core/Snackbar'
import {deletePost, editPost} from '../store/posts'

class PostItem extends React.Component {
  constructor(props) {
    super(props)
    this.post = this.props.post
    this.state = {
      openDialog: false,
      openToast: false
    }
    this.handleClickOpen = this.handleClickOpen.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.handleCopy = this.handleCopy.bind(this)
    this.handleOpenToast = this.handleOpenToast.bind(this)
    this.handleCloseToast = this.handleCloseToast.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
  }
  handleClickOpen() {
    this.setState({...this.state, openDialog: true})
  }
  handleClose() {
    this.setState({...this.state, openDialog: false})
  }
  handleCloseToast() {
    this.setState({...this.state, openToast: false})
  }
  handleOpenToast() {
    this.setState({...this.state, openToast: true})
  }
  handleCopy() {
    let success = copy(this.post.url)
    if (success) {
      this.handleOpenToast()
    }
  }
  handleDelete() {
    this.props.deletePost(this.props.userId, this.post.id)
  }
  render() {
    const tags = this.post.tags
    return (
      <React.Fragment>
        <Card style={{width: '18rem'}} className="post-item">
          <a href={this.post.url}>
            <Card.Img variant="top" src={this.post.image} />
          </a>
          <Card.Body>
            <Card.Subtitle as="h5">{this.post.title}</Card.Subtitle>
            <blockquote className="font-weight-light text-muted">
              {this.post.description}
            </blockquote>
          </Card.Body>
          <Card.Footer className="post-tags">
            <TagIcon />
            {tags.map(tag => (
              <Link
                className="tag-item"
                to={`/posts/${tag.content}`}
                key={tag.id}
              >
                {tag.content}
              </Link>
            ))}
            <IconButton aria-label="edit" onClick={this.handleClickOpen}>
              <EditIcon />
            </IconButton>
            <IconButton aria-label="delete" onClick={this.handleDelete}>
              <DeleteIcon />
            </IconButton>
            <IconButton aria-label="copy link" onClick={this.handleCopy}>
              <LinkIcon />
            </IconButton>
          </Card.Footer>
        </Card>
        <EditPost
          open={this.state.openDialog}
          handleClickOpen={this.handleClickOpen}
          handleClose={this.handleClose}
        />
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left'
          }}
          open={this.state.openToast}
          autoHideDuration={1500}
          onClose={this.handleCloseToast}
          ContentProps={{
            'aria-describedby': 'message-id'
          }}
          message={
            <span id="message-id">Link copied to clipboard successfully!</span>
          }
          action={[
            <IconButton
              key="close"
              aria-label="close"
              color="inherit"
              onClick={this.handleCloseToast}
            >
              <CloseIcon />
            </IconButton>
          ]}
        />
      </React.Fragment>
    )
  }
}

const mapState = state => ({
  userId: state.user.id
})

const mapDispatch = dispatch => ({
  deletePost: (userId, postId) => dispatch(deletePost(userId, postId)),
  editPost: (userId, postId, post) => dispatch(editPost(userId, postId, post))
})

export default connect(mapState, mapDispatch)(PostItem)
