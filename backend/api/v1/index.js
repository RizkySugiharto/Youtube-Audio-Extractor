const utils = require('../../utils')
const { BadRequest } = require('http-errors')
const ytdl = require('@distube/ytdl-core')

module.exports = function (fastify, opts, done) {
    fastify.post('/check', async (req, reply) => {
        try {
            if (!req.body || !req.body.url) {
                throw BadRequest('data [url] is required')
            }
            let isValid = ytdl.validateURL(req.body.url)
            return reply.code(200).send({isValid})
        } catch (error) {
            fastify.log.error(utils.convertToReadableErr(error))
            return utils.returnGeneralError(error, reply)
        }
    })

    fastify.post('/extract', async (req, reply) => {
        try {
            if (!req.body || !req.body.url) {
                throw BadRequest('data [url] is required')
            }
            let info = await ytdl.getInfo(req.body.url, { agent: fastify.ytdlAgent })
            return reply.code(200).send({
                thumbnail_url: info.videoDetails.thumbnails[0].url,
                title: info.videoDetails.title,
                author: info.videoDetails.author.name,
                upload_date: info.videoDetails.publishDate
            })
        } catch (error) {
            fastify.log.error(utils.convertToReadableErr(error))
            return utils.returnGeneralError(error, reply)
        }
    })

    fastify.post('/download', async (req, reply) => {
        try {
            if (!req.body || !req.body.url) {
                throw BadRequest('data [url] is required')
            }

            if (!ytdl.validateURL(req.body.url)) {
                throw BadRequest('Url is not valid')
            }
    
            const info = await ytdl.getInfo(req.body.url, { agent: fastify.ytdlAgent })
            const stream = ytdl(req.body.url, {
                filter: 'audioonly',
                quality: 'highestaudio',
                agent: fastify.ytdlAgent,
            })
            
            reply
                .header('content-type', 'audio/mpeg')
                .header('content-disposition', `attachment; filename="${encodeURI(info.videoDetails.title)}.mp3"`)
                .code(200)
    
            return stream
        } catch (error) {
            fastify.log.error(utils.convertToReadableErr(error))
            return utils.returnGeneralError(error, reply)
        }
    })

    fastify.put('/cookies', {
        preHandler: [fastify.authAdmin]
    }, async (req, reply) => {
        try {
            fastify.ytdlAgent = ytdl.createAgent(req.body)
            return reply.code(204).send()
        } catch (error) {
            fastify.log.error(utils.convertToReadableErr(error))
            return utils.returnGeneralError(error, reply)
        }
    })

    done()
}