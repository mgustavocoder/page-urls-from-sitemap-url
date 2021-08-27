module.exports = require('pino')({
  level: process.env.LOG_LEVEL || 'debug',
  prettyPrint: {
    colorize: true,
    crlf: true,
    errorLikeObjectKeys: ['err', 'error'],
    errorProps: '',
    levelFirst: true,
    messageKey: 'msg',
    levelKey: 'level',
    messageFormat: true,
    timestampKey: 'time',
    translateTime: true,
    ignore: 'pid,hostname',
    hideObject: false,
    singleLine: true
  }
})
