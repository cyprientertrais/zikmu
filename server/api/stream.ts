
import { defineEventHandler, getQuery, sendStream, setHeader, getRequestHeaders } from 'h3'
import ytdl from '@distube/ytdl-core'
import { PassThrough } from 'stream'

export default defineEventHandler(async (event) => {
    const { url } = getQuery(event)
    const headers = getRequestHeaders(event)

    if (!url || typeof url !== 'string' || !ytdl.validateURL(url)) {
        event.node.res.statusCode = 400
        return 'Invalid YouTube URL'
    }

    try {
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0' // seulement en dev

        const info = await ytdl.getInfo(url)
        const format = ytdl.chooseFormat(info.formats, {
            filter: 'audioonly',
            quality: 'highestaudio',
        })

        const contentLength = parseInt(format.contentLength || '0', 10)
        let start = 0
        let end = contentLength - 1

        const rangeHeader = headers.range

        if (rangeHeader && contentLength > 0) {
            const match = /bytes=(\d+)-(\d+)?/.exec(rangeHeader)
            if (match) {
                start = parseInt(match[1], 10)
                end = match[2] ? parseInt(match[2], 10) : end
            }

            event.node.res.statusCode = 206 // Partial Content
            setHeader(event, 'Content-Range', `bytes ${start}-${end}/${contentLength}`)
            setHeader(event, 'Accept-Ranges', 'bytes')
            setHeader(event, 'Content-Length', `${end - start + 1}`)
        } else {
            event.node.res.statusCode = 200
            setHeader(event, 'Content-Length', contentLength.toString())
            setHeader(event, 'Accept-Ranges', 'bytes')
        }

        setHeader(event, 'Content-Type', format.mimeType || 'audio/webm')

        const stream = ytdl(url, {
            format,
            range: { start, end },
            highWaterMark: 1 << 25,
        })

        const passthrough = new PassThrough()
        stream.pipe(passthrough)
        return sendStream(event, passthrough)
    } catch (err) {
        console.error('Streaming error:', err)
        event.node.res.statusCode = 500
        return 'Error during streaming'
    }
})
