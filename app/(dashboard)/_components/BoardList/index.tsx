import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'

import EmptyFavorites from '../EmptyStates/empty-favorites'
import EmptySearch from '../EmptyStates/empty-search'
import EmptyBoards from '../EmptyStates/empty-boards'
import BoardCard from '../BoardCard'
import NewBoardButton from '../NewBoardButton'

interface BoardListProps {
  orgId: string
  query: {
    search?: string
    favorites?: string
  }
}

const BoardList = ({ orgId, query }: BoardListProps) => {
  const data = useQuery(api.boards.get, {
    orgId,
    ...query,
  })

  if (data === undefined) {
    return (
      <div>
        <h2 className="text-3xl">
          {query.favorites ? 'Favorite Boards' : 'Team Boards'}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5 mt-8 pb-10">
          <NewBoardButton orgId={orgId} disabled={true} />
          <BoardCard.Skeleton />
          <BoardCard.Skeleton />
          <BoardCard.Skeleton />
          <BoardCard.Skeleton />
        </div>
      </div>
    )
  }

  if (!data.length && query.search) {
    return <EmptySearch />
  }

  if (!data.length && query.favorites) {
    return <EmptyFavorites />
  }

  if (!data.length) {
    return <EmptyBoards />
  }

  return (
    <div>
      <h2 className="text-3xl">
        {query.favorites ? 'Favorite Boards' : 'Team Boards'}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5 mt-8 pb-10">
        <NewBoardButton orgId={orgId} />
        {data.map((board) => (
          <BoardCard
            key={board._id}
            id={board._id}
            title={board.title}
            imageUrl={board.imageUrl}
            authorId={board.authorId}
            authorName={board.authorName}
            createdAt={board._creationTime}
            orgId={orgId}
            isFavorite={board.isFavorite}
          />
        ))}
      </div>
    </div>
  )
}

export default BoardList
