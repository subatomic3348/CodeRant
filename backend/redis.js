const Redis = require('ioredis')
const clientRedis = new Redis()
const workerRedis = new Redis()

const QUEUES = {
    JOBS:'JobQueue',
    PROCESSING:'ProcessingQueue',
    DEAD:'deadLetterQueue'
}
module.exports = {
    clientRedis,
    workerRedis,
    QUEUES
}