import axios from 'axios'
import {getTags} from './tags'
// Action Types
const GOT_POSTS = 'GOT_POSTS'
const ADDED_POST = 'ADDED_POST'
const DELETED_POST = 'DELETED_POST'
const EDITED_POST = 'EDITED_POST'

// Action Creators

const gotPosts = posts => ({
  type: GOT_POSTS,
  posts
})

const addedPost = post => ({
  type: ADDED_POST,
  post
})

const editedPost = post => ({
  type: EDITED_POST,
  post
})

const deletedPost = postId => ({
  type: DELETED_POST,
  postId
})

// Thunks

export const getPosts = userId => {
  return async dispatch => {
    const {data} = await axios.get(`/api/users/${userId}/posts`)
    dispatch(gotPosts(data))
  }
}

export const addPost = (userId, post) => {
  return async (dispatch, state) => {
    const {data} = await axios.post(`/api/users/${userId}/posts`, post)
    dispatch(addedPost(data))
    dispatch(getTags(userId))
  }
}

export const editPost = (userId, postId, post) => {
  return async (dispatch, state) => {
    const {data} = await axios.post(
      `/api/users/${userId}/posts/${postId}`,
      post
    )
    dispatch(editedPost(data))
    dispatch(getTags(userId))
  }
}

export const deletePost = (userId, postId) => {
  return async (dispatch, state) => {
    await axios.delete(`/api/users/${userId}/posts/${postId}`)
    dispatch(deletedPost(postId))
    dispatch(getTags(userId))
  }
}

// Reducer

export default function(posts = [], action) {
  let postCopy
  let foundIdx
  switch (action.type) {
    case GOT_POSTS:
      return action.posts
    case ADDED_POST:
      return [...posts, action.post]
    case EDITED_POST:
      postCopy = [...posts]
      foundIdx = postCopy.findIndex(post => post.id === action.post.id)
      postCopy[foundIdx] = action.post
      return postCopy
    case DELETED_POST:
      postCopy = [...posts]
      foundIdx = postCopy.findIndex(post => post.id === action.postId)
      postCopy.splice(foundIdx, 1)
      return postCopy
    default:
      return posts
  }
}
