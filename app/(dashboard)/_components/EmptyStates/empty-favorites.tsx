import Image from 'next/image'

const EmptyFavorites = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center">
      <Image
        src="/empty-favorites.svg"
        alt="Empty favorites"
        width={140}
        height={140}
      />
      <h2 className="text-2xl font-semibold mt-6">No favorite boards!</h2>
      <p className="text-muted-foreground text-sm font-semibold mt-2">
        Try favoriting a board
      </p>
    </div>
  )
}

export default EmptyFavorites
