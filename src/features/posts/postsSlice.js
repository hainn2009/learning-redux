import {
  createSlice,
  // nanoid
  createAsyncThunk,
  createSelector,
  createEntityAdapter,
} from '@reduxjs/toolkit'
// import { sub } from 'date-fns'
import { client } from '../../api/client'

const postsAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.date.localeCompare(a.date),
})

const initialState = postsAdapter.getInitialState({
  status: 'idle',
  error: null,
})

// const initialState = [
//   {
//     id: '1',
//     title: 'First Post',
//     content: 'Hello',
//     user: '0',
//     date: sub(new Date(), { minutes: 10 }).toISOString(),
//     reactions: { thumbsUp: 1, hooray: 2, heart: 3, rocket: 4, eyes: 5 },
//   },
//   {
//     id: '2',
//     title: 'Second Post',
//     content: 'How are you',
//     user: '1',
//     date: sub(new Date(), { minutes: 5 }).toISOString(),
//     reactions: { thumbsUp: 5, hooray: 4, heart: 2, rocket: 3, eyes: 1 },
//   },
// ]

// comment vì đã chuyển sang createEntityAdapter
// const initialState = {
//   posts: [],
//   status: 'idle',
//   error: null,
// }

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  const response = await client.get('/fakeApi/posts')
  return response.data
})

export const addNewPost = createAsyncThunk(
  'posts/addNewPost',
  async (initialPost) => {
    const response = await client.post('/fakeApi/posts', initialPost)
    return response.data
  }
)

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    // Ly do comment la da chuyen sang createAsyncThunk
    // postAdded: {
    //   reducer(state, action) {
    //     state.posts.push(action.payload)
    //   },
    //   prepare: (title, content, userId) => {
    //     return {
    //       id: nanoid(),
    //       date: new Date().toISOString(),
    //       title,
    //       content,
    //       user: userId,
    //       reactions: { thumbsUp: 0, hooray: 0, heart: 0, rocket: 0, eyes: 0 },
    //     }
    //   },
    // },
    reactionAdded(state, action) {
      const { postId, reaction } = action.payload
      // moved posts to entity adapter so comments here
      // const existingPost = state.posts.find((post) => post.id === postId)
      const existingPost = state.entities[postId]
      if (existingPost) existingPost.reactions[reaction]++
    },
    postUpdated(state, action) {
      const { id, title, content } = action.payload
      // const existingPost = state.posts.find((post) => post.id === id)
      const existingPost = state.entities[id]
      if (existingPost) {
        existingPost.title = title
        existingPost.content = content
      }
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchPosts.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = 'succeeded'
        // moved to entityadapter
        // state.posts = state.posts.concat(action.payload)
        // Use the `upsertMany` reducer as a mutating update utility
        postsAdapter.upsertMany(state, action.payload)
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
      // moved to entity adapter
      // builder.addCase(addNewPost.fulfilled, (state, action) => {
      //   state.posts.push(action.payload)
      // })
      // Use the `addOne` reducer for the fulfilled case
      .addCase(addNewPost.fulfilled, postsAdapter.addOne)
  },
})

export const { postAdded, postUpdated, reactionAdded } = postsSlice.actions

export default postsSlice.reducer

// moved to entity adapter
// export const selectAllPosts = (state) => state.posts.posts
// export const selectPostById = (state, postId) =>
//   state.posts.posts.find((post) => post.id === postId)

// Export the customized selectors for this adapter using `getSelectors`
export const {
  selectAll: selectAllPosts,
  selectById: selectPostById,
  selectIds: selectPostIds,
  // Pass in a selector that returns the posts slice of state
} = postsAdapter.getSelectors((state) => state.posts)

export const selectPostsByUser = createSelector(
  [selectAllPosts, (state, userId) => userId],
  (posts, userId) => posts.filter((post) => post.user === userId)
)
