import React from 'react'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogTitle from '@material-ui/core/DialogTitle'
import CreatableSelect from 'react-select/creatable'
import {connect} from 'react-redux'
import {editPost} from '../store/posts'

const style = {
  display: 'flex',
  flexDirection: 'column'
}
class EditPost extends React.Component {
  constructor(props) {
    super(props)
    this.postTags = this.props.post.tags
    this.tagOptions = this.props.tags.map(tag => ({
      label: tag.content,
      value: tag.content
    }))
    this.defaultTags = this.tagOptions.filter(tagObj => {
      return this.postTags.findIndex(tag => tag.content === tagObj.value) >= 0
    })
    this.handleChange = this.handleChange.bind(this)
    this.handleTags = this.handleTags.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.state = {
      title: this.props.post.title,
      description: this.props.post.description,
      tags: this.defaultTags
    }
  }
  handleChange(event) {
    this.setState({...this.state, [event.target.name]: event.target.value})
  }
  handleTags(event) {
    this.setState({...this.state, tags: event})
  }
  handleSubmit(event) {
    event.preventDefault()
    event.target.disabled = true
    let tags = this.state.tags.map(tag => tag.value)
    const dispatchBody = {
      title: this.state.title,
      description: this.state.description,
      tags
    }
    this.props.editPost(this.props.userId, this.props.post.id, dispatchBody)
    this.props.handleClose()
  }

  render() {
    let {handleClose, open} = this.props
    return (
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
        fullWidth={true}
        maxWidth="lg"
      >
        <DialogTitle id="form-dialog-title">Edit Link preview</DialogTitle>
        <form onSubmit={this.handleSubmit} style={style}>
          <TextField
            required
            value={this.state.title}
            onChange={event => this.handleChange(event)}
            id="standard-required"
            label="Title"
            name="title"
            placeholder="Link Title"
            margin="normal"
          />
          <TextField
            required
            value={this.state.description}
            onChange={event => this.handleChange(event)}
            id="standard-required"
            label="Description"
            name="description"
            placeholder="Link Description"
            margin="normal"
          />
          <CreatableSelect
            isMulti
            defaultValue={this.defaultTags}
            name="tags"
            onChange={this.handleTags}
            options={this.tagOptions}
          />
          <Button color="primary" type="submit">
            Submit Changes
          </Button>
        </form>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}

const mapState = state => ({
  tags: state.tags,
  userId: state.user.id
})
const mapDispatch = dispatch => ({
  editPost: (userId, postId, post) => dispatch(editPost(userId, postId, post))
})
export default connect(mapState, mapDispatch)(EditPost)
