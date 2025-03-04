const { Forbidden, Unauthorized } = require('http-errors')

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
    fastify.decorate('ytdlAgent', undefined)
    fastify.decorate('authAdmin', (req, reply, done) => {
        if (!req.headers['authorization']) {
            throw Unauthorized("You don't have any key to access this endpoint!")
        }

        const authType = req.headers['authorization'].substring(0, 6)
        const authToken = req.headers['authorization'].substring(7)
        if (authType != 'Bearer' || authToken != process.env.API_ADMIN_KEY) {
            throw Forbidden("Your key is invalid! LOL")
        }
        done()
    })
    fastify.register(require('@fastify/compress'))
}

module.exports = {
    loadPlugins
}