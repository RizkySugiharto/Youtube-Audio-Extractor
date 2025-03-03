const { BadRequest, InternalServerError } = require('http-errors')
const ytdl = require('@distube/ytdl-core')

function getRandomIPv4() {
    return (Math.floor(Math.random() * 255) + 1)+"."+(Math.floor(Math.random() * 255))+"."+(Math.floor(Math.random() * 255))+"."+(Math.floor(Math.random() * 255))
}

function isDevMode() {
    return process.env.NODE_ENV === 'development'
}

function returnGeneralError(error, reply) {
    const statusCode = error.statusCode || 500
    return isDevMode() ?
        reply.code(statusCode).send(error) :
        reply.code(statusCode).send({
            400: BadRequest('Something went wrong with the request'),
            500: InternalServerError('Something went wrong with the server')
        }[statusCode] || error)
}

function createYtdlAgent(caches) {
    return ytdl.createAgent(caches, {
        pipelining: 3,
        localAddress: getRandomIPv4()
    })
}

module.exports = {
    isDevMode,
    returnGeneralError,
    createYtdlAgent
}