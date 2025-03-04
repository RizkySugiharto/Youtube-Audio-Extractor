const { BadRequest, InternalServerError } = require('http-errors')

function isDevMode() {
    return process.env.NODE_ENV === 'development'
}

function returnGeneralError(error, reply) {
    const statusCode = error.statusCode || 500
    return isDevMode() ?
        reply.code(statusCode).send(error) :
        reply.code(statusCode).send({
            500: InternalServerError('Something went wrong with the server')
        }[statusCode] || error)
}

function convertToReadableErr(error) {
    const regex = new RegExp(/\/([\/\w-_\.]+\.js):(\d*):(\d*)/)
    const errorInfo = error.stack.match(regex);

    if (errorInfo && errorInfo.length >= 4) {
        const [, filename, line, column] = errorInfo;
        return `${filename}:${line}:${column} ${error}`;
    }
    return `${error}`;
}

module.exports = {
    isDevMode,
    returnGeneralError,
    convertToReadableErr
}