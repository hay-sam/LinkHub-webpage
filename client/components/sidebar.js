import React from 'react'
import {getTags} from '../store/tags'
import {connect} from 'react-redux'

class Sidebar extends React.Component {
  render() {
    return (
      <div className="sidebar bg-secondary text-light">
        <h5>Tags</h5>
      </div>
    )
  }
  componentDidMount() {
    this.props.getTags(this.props.userId)
  }
}

const mapStateToProps = state => ({
  userId: state.user.id,
  tags: state.tags
})

const mapDispatchToProps = dispatch => ({
  getTags: id => dispatch(getTags(id))
})

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar)
