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

function convertToReadableErr(error) {
    const regex = new RegExp(`${process.cwd()}\\/(?!node_modules\\/)([\\/\\w-_\\.]+\\.js):(\\d*):(\\d*)`)
    const [, filename, line, column] = error.stack.match(regex);

    return `${filename}:${line}:${column} ${error}`;
}

function createYtdlAgent(cookies) {
    // {
    //     pipelining: 3,
    //     localAddress: getRandomIPv4()
    // }
    return ytdl.createAgent(cookies)
}

module.exports = {
    isDevMode,
    returnGeneralError,
    createYtdlAgent,
    convertToReadableErr
}