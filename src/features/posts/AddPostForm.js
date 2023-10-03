import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

// import { postAdded } from './postsSlice'
// old code
// import { addNewPost } from './postsSlice'

import { Spinner } from '../../components/Spinner'
import { useAddNewPostMutation } from '../api/apiSlice'
import { selectAllUsers } from '../users/usersSlice'

export const AddPostForm = () => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [userId, setUserId] = useState('')

  const [addNewPost, { isLoading }] = useAddNewPostMutation()
  const users = useSelector(selectAllUsers)

  //old code
  // const [AddRequestStatus, setAddRequestStatus] = useState('idle')
  // const dispatch = useDispatch()
  const onTitleChanged = (e) => setTitle(e.target.value)
  const onContentChanged = (e) => setContent(e.target.value)
  const onAuthorChanged = (e) => setUserId(e.target.value)
  // const canSave = [title, content, userId].every(Boolean) && AddRequestStatus === 'idle'
  const canSave = [title, content, userId].every(Boolean) && !isLoading

  const onSavePostClicked = async () => {
    if (canSave) {
      try {
        // setAddRequestStatus('pending')
        // await dispatch(addNewPost({ title, content, user: userId })).unwrap()
        await addNewPost({ title, content, user: userId }).unwrap()
        setTitle('')
        setContent('')
        setUserId('')
      } catch (err) {
        console.log('Failed to save the post', err)
        // } finally {
        // setAddRequestStatus('idle')
      }
    }
  }
  const userOptions = users.map((user) => (
    <option key={user.id} value={user.id}>
      {user.name}
    </option>
  ))

  const spinner = isLoading ? <Spinner size="30px" /> : null

  return (
    <section>
      <h2>Add a New Post</h2>
      <form>
        <label htmlFor="postTitle">Post Title:</label>
        <input
          type="text"
          name="postTitle"
          value={title}
          onChange={onTitleChanged}
        />
        <label htmlFor="postAuthor">Author:</label>
        <select name="postAuthor" value={userId} onChange={onAuthorChanged}>
          <option value=""></option>
          {userOptions}
        </select>
        <label htmlFor="postContent">Content:</label>
        <input
          type="text"
          name="postContent"
          value={content}
          onChange={onContentChanged}
        />
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <button type="button" onClick={onSavePostClicked} disabled={!canSave}>
            Save Post
          </button>
          {spinner}
        </div>
      </form>
    </section>
  )
}
