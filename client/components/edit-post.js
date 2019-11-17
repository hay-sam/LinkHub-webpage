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
    this.state = {
      title: '',
      description: '',
      tags: []
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleTags = this.handleTags.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  handleChange(event) {
    console.log('target:', event.target.name)
    console.log('value:', event.target.value)
    console.log('state', this.state)
    this.setState({...this.state, [event.target.name]: event.target.value})
    console.log('state', this.state)
  }
  handleTags(event) {
    console.log('state', this.state)
    this.setState({...this.state, tags: event})
    console.log('state', this.state)
  }
  handleSubmit(event) {
    event.preventDefault()
    event.target.disabled = true
    let tags = this.state.tags.map(tag => tag.value)
    const dispatchBody = {url: this.state.url, tags}
    this.props.addPost(this.props.userId, dispatchBody)
    this.props.handleClose()
  }

  render() {
    const tags = this.props.tags
    let {handleClose, open} = this.props
    let tagOptions = tags.map(tag => ({
      label: tag.content,
      value: tag.content
    }))
    return (
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
        fullWidth={true}
        maxWidth="lg"
      >
        <DialogTitle id="Add a new Link">Subscribe</DialogTitle>
        <form onSubmit={this.handleSubmit} style={style}>
          <TextField
            required
            value={this.state.url}
            onChange={event => this.handleChange(event)}
            id="standard-required"
            label="URL"
            name="url"
            placeholder="Enter the link you'd like to save!"
            margin="normal"
          />
          <CreatableSelect
            isMulti
            name="tags"
            onChange={this.handleTags}
            options={tagOptions}
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
  addPost: (userId, postId, post) => dispatch(editPost(userId, postId, post))
})
export default connect(mapState, mapDispatch)(EditPost)
