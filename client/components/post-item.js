import React from 'react'
import Card from 'react-bootstrap/Card'
import {Link} from 'react-router-dom'

const PostItem = ({post}) => {
  const tags = post.tags
  return (
    <Card style={{width: '18rem'}} className="post-item">
      <a href={post.url}>
        <Card.Img variant="top" src={post.image} />
      </a>
      <Card.Body>
        <Card.Subtitle as="h5">{post.title}</Card.Subtitle>
        <blockquote className="font-weight-light text-muted">
          {post.description}
        </blockquote>
      </Card.Body>
      <Card.Footer className="post-tags">
        <i className="fas fa-tags" />
        {tags.map(tag => (
          <Link className="tag-item" to={`/posts/${tag.content}`} key={tag.id}>
            {tag.content}
          </Link>
        ))}
      </Card.Footer>
    </Card>
  )
}

export default PostItem
