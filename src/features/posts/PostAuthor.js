import React from 'react'
import { useSelector } from 'react-redux'
import { selectUserById } from '../users/usersSlice'

export const PostAuthor = ({ userId }) => {
  // moved to apislice
  // const author = useSelector((state) =>
  //   state.users.find((user) => user.id === userId)
  // )
  const author = useSelector((state) => selectUserById(state, userId))
  return <span>by {author ? author.name : 'Unknown Author'}</span>
}
