const ytdl = require('@distube/ytdl-core')

async function loadPlugins(fastify) {
    fastify.register(require('@fastify/cors'), {
        origin: process.env.ALLOWED_ORIGINS.split(' '),
        credentials: true,
        exposedHeaders: ['X-Ratelimit-Reset', 'Retry-After']
    })
    
    await fastify.register(require('@fastify/rate-limit'), {
        max: Number(process.env.ALLOWED_REQUEST_PER_MINUTE),
        timeWindow: 60 * 1000,
        hook: 'preHandler',
        keyGenerator: (req) => req.ip
    })
    fastify.decorate('ytdlAgent', ytdl.createAgent(JSON.parse(process.env.YTDL_COOKIES)))
    fastify.register(require('@fastify/compress'))
}

module.exports = {
    loadPlugins
}