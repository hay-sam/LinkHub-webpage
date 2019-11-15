import React from 'react'
import Card from 'react-bootstrap/Card'

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
        {tags.map(tag => (
          <Card.Link href="#" key={tag.id}>
            {tag.content}
          </Card.Link>
        ))}
      </Card.Body>
    </Card>
  )
}

export default PostItem
