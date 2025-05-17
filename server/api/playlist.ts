
import { defineEventHandler, getQuery } from 'h3'
import ytpl from 'ytpl'

export default defineEventHandler(async (event) => {
    const { id } = getQuery(event)

    if (!id || typeof id !== 'string') {
        return { error: 'Missing or invalid playlist ID' }
    }

    try {
        const playlist = await ytpl(id, { pages: 1 })

        return {
            title: playlist.title,
            items: playlist.items.map((item) => ({
                title: item.title,
                id: item.id,
                url: `https://www.youtube.com/watch?v=${item.id}`,
                duration: item.duration,
                thumbnail: item.bestThumbnail.url,
            })),
        }
    } catch (e) {
        console.error('Playlist fetch error:', e)
        return { error: 'Failed to fetch playlist' }
    }
})
