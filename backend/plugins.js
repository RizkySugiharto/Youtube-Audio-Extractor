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
    fastify.decorate('ytdlAgent', undefined)
    fastify.decorate('proxyManager', {
        current: 0,
        addresses: [
            '152.26.229.66:9443', 
            '152.26.229.42:9443', 
            '152.26.229.88:9443', 
            '152.26.231.42:9443', 
            '152.26.231.86:9443', 
            '152.26.231.77:9443', 
            '152.26.229.88:9443',
            '177.234.241.27:999',
            '177.234.241.30:999',
            '177.234.241.26:999',
            '177.234.241.25:999'
        ],
        rotate: function() {
            this.current = (this.current + 1) % this.addresses.length
        },
        getAddress: function() {
            return this.addresses[this.current]
        }
    })
    fastify.register(require('@fastify/compress'))
}

module.exports = {
    loadPlugins
}