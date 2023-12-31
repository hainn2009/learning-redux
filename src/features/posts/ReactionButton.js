import React from 'react'
import { useDispatch } from 'react-redux'
import { reactionAdded } from './postsSlice'

import { useAddReactionMutation } from '../api/apiSlice'

const reactionEmoji = {
  thumbsUp: '👍',
  hooray: '🎉',
  heart: '❤️',
  rocket: '🚀',
  eyes: '👀',
}

export const ReactionButtons = ({ post }) => {
  // moved to useAddReactionMutation
  // const dispatch = useDispatch()

  const [addReaction] = useAddReactionMutation()

  const reactionButtons = Object.entries(reactionEmoji).map(
    ([reactionName, emoji]) => {
      return (
        <button
          key={reactionName}
          type="button"
          className="muted-button reaction-button"
          onClick={() =>
            // dispatch(reactionAdded({ postId: post.id, reaction: name }))
            addReaction({ postId: post.id, reaction: reactionName })
          }
        >
          {emoji} {post.reactions[reactionName]}
        </button>
      )
    }
  )

  return <div>{reactionButtons}</div>
}
