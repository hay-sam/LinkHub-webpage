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

// Reducer

export default function(posts = [], action) {
  switch (action.type) {
    case GOT_POSTS:
      return action.posts
    case ADDED_POST:
      return [...posts, action.post]
    default:
      return posts
  }
}
