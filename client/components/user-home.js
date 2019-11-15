import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import SideBar from './sidebar'
import Posts from './posts'

/**
 * COMPONENT
 */
export const UserHome = props => {
  const {email} = props

  return (
    <div className="main">
      <SideBar />
      <Posts />
    </div>
  )
}

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    email: state.user.email
  }
}

export default connect(mapState)(UserHome)

/**
 * PROP TYPES
 */
UserHome.propTypes = {
  email: PropTypes.string
}
