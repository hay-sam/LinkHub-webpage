import React from 'react'
import Card from 'react-bootstrap/Card'
import axios from 'axios'
import ResponsiveEmbed from 'react-bootstrap/ResponsiveEmbed'

class PostItem extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      url: this.props.post.url,
      image: '',
      description: "Hmmm this page doesn't have a description",
      title: "I'm the title Now",
      contentType: ''
    }
  }
  async componentDidMount() {
    let {data} = await axios.post('/api/linkPreview', {
      url: this.props.post.url
    })
    if (data.contentType !== 'image/jpeg') {
      if (data.images) {
        this.setState({...this.state, image: data.images[0]})
      } else {
        this.setState({
          ...this.state,
          image:
            'https://cdn1-www.dogtime.com/assets/uploads/2011/03/puppy-development.jpg'
        })
      }
    } else {
      this.setState({...this.state, image: data.url})
    }

    if (data.description) {
      this.setState({...this.state, description: data.description})
    }
    if (data.title) {
      this.setState({...this.state, title: data.title})
    }
    this.setState({...this.state, contentType: data.contentType})
  }
  render() {
    const tags = this.props.post.tags
    return (
      <Card style={{width: '18rem'}} className="post-item">
        <a href={this.props.post.url}>
          {this.state.contentType === 'video/mp4' ? (
            <Card.Header>
              <ResponsiveEmbed aspectRatio="4by3">
                <iframe src={this.state.url} />
              </ResponsiveEmbed>
            </Card.Header>
          ) : (
            <Card.Img variant="top" src={this.state.image} />
          )}
        </a>
        <Card.Body>
          <Card.Subtitle as="h5">{this.state.title}</Card.Subtitle>
          <blockquote className="font-weight-light text-muted">
            {this.state.description}
          </blockquote>
          {tags.map(tag => (
            <Card.Link href="#" key={tag.id}>
              {tag.content}
            </Card.Link>
          ))}
        </Card.Body>
      </Card>
    )
  }
}

export default PostItem
