const utils = require('../../utils')
const { BadRequest } = require('http-errors')
const ytdl = require('@distube/ytdl-core')

module.exports = function (fastify, opts, done) {
    fastify.get('/check', async (req, reply) => {
        try {
            if (!req.query.url) {
                throw BadRequest('Query [url] is required')
            }
            let isValid = ytdl.validateURL(req.query.url)
            return reply.code(200).send({isValid})
        } catch (error) {
            fastify.log.error(error)
            return utils.returnGeneralError(error, reply)
        }
    })

    fastify.get('/extract', async (req, reply) => {
        try {
            if (!req.query.url) {
                throw BadRequest('Query [url] is required')
            }
            let info = await ytdl.getInfo(req.query.url, { agent: fastify.ytdlAgent })
            return reply.code(200).send({
                thumbnail_url: info.videoDetails.thumbnails[0].url,
                title: info.videoDetails.title,
                author: info.videoDetails.author.name,
                upload_date: info.videoDetails.publishDate
            })
        } catch (error) {
            fastify.log.error(error)
            return utils.returnGeneralError(error, reply)
        }
    })

    fastify.get('/download', async (req, reply) => {
        try {
            if (!req.query.url) {
                throw BadRequest('Query [url] is required')
            }
    
            const info = await ytdl.getInfo(req.query.url, { agent: fastify.ytdlAgent })
            const stream = ytdl(req.query.url, {
                filter: 'audioonly',
                quality: 'highestaudio',
                agent: fastify.ytdlAgent
            })
            
            reply
                .header('content-type', 'audio/mpeg')
                .header('content-disposition', `attachment; filename="${encodeURI(info.videoDetails.title)}.mp3"`)
                .code(200)
    
            return stream
        } catch (error) {
            fastify.log.error(error)
            return utils.returnGeneralError(error, reply)
        }
    })

    fastify.put('/cookies', async (req, reply) => {
        try {
            fastify.ytdlAgent = utils.createYtdlAgent(req.body)
            return reply.code(204).send()
        } catch (error) {
            fastify.log.error(error)
            return utils.returnGeneralError(error, reply)
        }
    })

    done()
}