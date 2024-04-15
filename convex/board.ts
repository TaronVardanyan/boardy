import { mutation, query } from './_generated/server'
import { v } from 'convex/values'

const images = [
  '/placeholders/1.svg',
  '/placeholders/2.svg',
  '/placeholders/3.svg',
  '/placeholders/4.svg',
  '/placeholders/5.svg',
  '/placeholders/6.svg',
  '/placeholders/7.svg',
  '/placeholders/8.svg',
  '/placeholders/9.svg',
  '/placeholders/10.svg',
]

export const create = mutation({
  args: {
    orgId: v.string(),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()

    if (!identity) {
      throw new Error('Unauthorized')
    }

    const randomImage = images[Math.floor(Math.random() * images.length)]

    const board = await ctx.db.insert('boards', {
      orgId: args.orgId,
      title: args.title,
      authorId: identity.subject,
      authorName: identity.name!,
      imageUrl: randomImage,
    })

    return board
  },
})

export const remove = mutation({
  args: {
    id: v.id('boards'),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()

    if (!identity) {
      throw new Error('Unauthorized')
    }

    const userId = identity.subject

    const existingFavorite = await ctx.db
      .query('userFavorites')
      .withIndex('by_user_board', (q) =>
        q.eq('userId', userId).eq('boardId', args.id),
      )
      .unique()

    if (existingFavorite) {
      await ctx.db.delete(existingFavorite._id)
    }

    await ctx.db.delete(args.id)
  },
})

export const update = mutation({
  args: {
    id: v.id('boards'),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const title = args.title.trim()
    const identity = await ctx.auth.getUserIdentity()

    if (!identity) {
      throw new Error('Unauthorized')
    }

    if (!title) {
      throw new Error('Title is required')
    }

    if (title.length > 60) {
      throw new Error('Title cannot be longer than 60 characters')
    }

    const board = ctx.db.patch(args.id, {
      title,
    })

    return board
  },
})

export const favorite = mutation({
  args: {
    orgId: v.string(),
    id: v.id('boards'),
    title: v.string(),
    authorName: v.string(),
    authorId: v.string(),
    imageUrl: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()

    if (!identity) {
      throw new Error('Unauthorized')
    }

    const board = await ctx.db.get(args.id)

    if (!board) {
      throw new Error('Board not found')
    }

    const userId = identity.subject
    const existingFavorite = await ctx.db
      .query('userFavorites')
      .withIndex('by_user_board', (q) =>
        q.eq('userId', userId).eq('boardId', board._id),
      )
      .unique()

    if (existingFavorite) {
      throw new Error('Board already favorited')
    }

    await ctx.db.insert('userFavorites', {
      userId,
      boardId: board._id,
      orgId: args.orgId,
      title: args.title,
      authorId: args.authorId,
      authorName: args.authorName,
      imageUrl: args.imageUrl,
    })

    return board
  },
})

export const unfavorite = mutation({
  args: {
    id: v.id('boards'),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()

    if (!identity) {
      throw new Error('Unauthorized')
    }

    const board = await ctx.db.get(args.id)

    if (!board) {
      throw new Error('Board not found')
    }

    const userId = identity.subject
    const existingFavorite = await ctx.db
      .query('userFavorites')
      .withIndex('by_user_board', (q) =>
        q.eq('userId', userId).eq('boardId', board._id),
      )
      .unique()

    if (!existingFavorite) {
      throw new Error('Favorited board not found')
    }

    await ctx.db.delete(existingFavorite._id)

    return board
  },
})

export const get = query({
  args: {
    id: v.id('boards'),
  },
  handler: async (ctx, args) => {
    const board = ctx.db.get(args.id)

    return board
  },
})
