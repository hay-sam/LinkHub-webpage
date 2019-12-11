import React from 'react'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogTitle from '@material-ui/core/DialogTitle'
import CreatableSelect from 'react-select/creatable'
import {connect} from 'react-redux'
import {addPost} from '../store/posts'

const style = {
  display: 'flex',
  flexDirection: 'column'
}
class AddPost extends React.Component {
  constructor() {
    super()
    this.state = {
      url: '',
      tags: []
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleTags = this.handleTags.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  handleChange(event) {
    this.setState({[event.target.name]: event.target.value}) //Controlled form, updates post url
  }
  handleTags(event) {
    this.setState({tags: event}) //Controlled form, updates post tags
  }
  handleSubmit(event) {
    event.preventDefault()
    event.target.disabled = true
    let tags = this.state.tags.map(tag => tag.value) // Convert from react-select option {label, value} to just the tag content
    const dispatchBody = {url: this.state.url, tags}
    this.props.addPost(this.props.userId, dispatchBody)
    this.setState({url: '', tags: []}) // Reset State
    this.props.handleClose() // Close form dialog
  }

  render() {
    const tags = this.props.tags
    let {handleClose, open} = this.props
    let tagOptions = tags.map(tag => ({
      // Format tags for react-select
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
        <DialogTitle id="form-dialog-title">Save a new Link!</DialogTitle>
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
          <CreatableSelect //react-select, multi select, have pre-defined options, or add your own
            isMulti
            name="tags"
            onChange={this.handleTags}
            options={tagOptions} // Pre-defined options (not-selected)
          />
          <Button color="primary" variant="outlined" type="submit">
            Save Link
          </Button>
        </form>
        <DialogActions>
          <Button onClick={handleClose} variant="outlined" color="primary">
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
  addPost: (id, post) => dispatch(addPost(id, post))
})
export default connect(mapState, mapDispatch)(AddPost)
