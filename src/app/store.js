import { configureStore } from '@reduxjs/toolkit'
import postsReducer from '../features/posts/postsSlice'
// import usersSlice from '../features/users/usersSlice'
import notificationReducer from '../features/notifications/notificationsSlice'
import { apiSlice } from '../features/api/apiSlice'

export default configureStore({
  reducer: {
    posts: postsReducer,
    // moved to apiSlice
    // users: usersSlice,
    notifications: notificationReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
})
