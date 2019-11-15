import axios from 'axios'

// Action Types

const GOT_TAGS = 'GOT_TAGS'

// Action Creators

const gotTags = tags => ({
  type: GOT_TAGS,
  tags
})

// Thunks

export const getTags = userId => {
  return async dispatch => {
    const {data} = await axios.get(`/api/users/${userId}/tags`)
    dispatch(gotTags(data))
  }
}

// Reducer

export default function(tags = [], action) {
  switch (action.type) {
    case GOT_TAGS:
      return action.tags
    default:
      return tags
  }
}
