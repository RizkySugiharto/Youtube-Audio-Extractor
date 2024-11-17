async function main() {
    const utils = require('./utils')

    // Load environtment configuration
    const config = require('./config')
    config.loadConfig()
    
    // Initialize the app
    const logger = require('./logger')
    const fastify = require('fastify')({
        logger: logger
    })
    
    // Register all plugins
    const plugins = require('./plugins')
    await plugins.loadPlugins(fastify)
    
    // Register all routes
    fastify.register(require(`./api/v${process.env.API_VERSION}/index`), { prefix: `/api/v${process.env.API_VERSION}` })
    fastify.get('/', async (req, reply) => {
        return "Hello, World"
    })
    
    // Start the app
    fastify.listen({ port: process.env.PORT, host: '0.0.0.0' }, (err, address) => {
        if (err) {
            fastify.log.error(err)
            process.exit(1)
        }
        fastify.log.info(`App listening on: ${address}`)
    })
}

main()