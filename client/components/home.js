import React from 'react'
import Typography from '@material-ui/core/Typography'
import {Link} from 'react-router-dom'

const Home = props => {
  return (
    <div id="home">
      <br />
      <Typography variant="h3">Welcome to LinkHub!</Typography>
      <br />
      <div id="home-content">
        <Typography variant="subtitle1">
          Save links from across the web with the click of a button!
        </Typography>
        <Typography variant="subtitle1">
          View your saved links in an easy to navigate interface!
        </Typography>
        <img id="home-logo" src="./LinkHub.png" />
        <Typography variant="subtitle1">
          Tag your links for easy lookup later!
        </Typography>
        <Typography variant="subtitle1">
          <Link to="login">Log in</Link> or <Link to="signup">sign up</Link> to
          start growing your Hub!
        </Typography>
        <Typography variant="subtitle1">
          Click{' '}
          <a
            href="https://github.com/hay-sam/LinkHub-extension"
            target="_blank"
            rel="noopener noreferrer"
          >
            here
          </a>{' '}
          to download the Chrome Extension!
        </Typography>
      </div>
    </div>
  )
}

export default Home
