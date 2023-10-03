import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import classnames from 'classnames'
import { PostAuthor } from './PostAuthor'
import { TimeAgo } from './TimeAgo'
import { ReactionButtons } from './ReactionButton'
import { Spinner } from '../../components/Spinner'
import { useSelector } from 'react-redux'
// import { selectAllPosts } from './postsSlice'
// import { useDispatch } from 'react-redux'
// import { fetchPosts } from './postsSlice'
import {
  selectAllPosts,
  fetchPosts,
  selectPostIds,
  selectPostById,
} from './postsSlice'

import { useGetPostsQuery } from '../api/apiSlice'

let PostExcerpt = ({ post }) => {
  // moved to useGetPostQuery
  // const post = useSelector((state) => selectPostById(state, postId))
  return (
    <article className="post-excerpt">
      <h3>{post.title}</h3>
      <div>
        <PostAuthor userId={post.user} />
        <TimeAgo timestamp={post.date} />
      </div>
      <p className="post-content">{post.content.substring(0, 100)}</p>

      <ReactionButtons post={post} />
      <Link to={`/posts/${post.id}`} className="button muted-button">
        View Post
      </Link>
    </article>
  )
}

// PostExerpt = React.memo(PostExerpt)

export const PostsList = () => {
  const {
    data: posts = [], // default value is undefined, so can't sort
    isLoading,
    isFetching,
    isSuccess,
    isError,
    error,
    refetch,
  } = useGetPostsQuery()

  const sortedPosts = useMemo(() => {
    const sortedPosts = posts.slice()
    // Sort posts in descending chronological order
    sortedPosts.sort((a, b) => b.date.localeCompare(a.date))
    return sortedPosts
  }, [posts])

  // Old code not use
  // const dispatch = useDispatch()
  // const orderedPostIds = useSelector(selectPostIds)
  // const posts = useSelector(selectAllPosts)
  // const postStatus = useSelector((state) => state.posts.status)
  // const error = useSelector((state) => state.posts.error)
  // useEffect(() => {
  //   if (postStatus === 'idle') {
  //     dispatch(fetchPosts())
  //   }
  // }, [postStatus, dispatch])
  let content

  if (isLoading) {
    content = <Spinner text="Loading..." />
  } else if (isSuccess) {
    const renderedPosts = sortedPosts.map((post) => (
      <PostExcerpt key={post.id} post={post} />
    ))

    const containerClassname = classnames('posts-container', {
      disabled: isFetching,
    })

    content = <div className={containerClassname}>{renderedPosts}</div>
  } else if (isError) {
    content = <div>{error.toString()}</div>
  }

  // if (postStatus === 'loading') {
  //   return <Spinner text="Loading..." />
  // } else if (postStatus === 'succeeded') {
  //   const orderedPosts = posts
  //     .slice()
  //     .sort((a, b) => b.date.localeCompare(a.date))
  //   content = orderedPosts.map((post) => (
  //     <PostExerpt key={post.id} post={post} />
  //   ))
  // content = orderedPostIds.map(postId => (
  //   <PostExcerpt key={postId} postId={postId} />
  // ))
  // } else if (postStatus === 'failed') {
  //   content = <div>{error}</div>
  // }

  return (
    <section className="posts-list">
      <h2>Posts</h2>
      <button onClick={refetch}>Refetch Posts</button>
      {content}
    </section>
  )
}
