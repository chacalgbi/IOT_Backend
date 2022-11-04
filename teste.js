const timer = require('./utils/dataHora')

const dateFormated = timer().replace(/\//g, '\\').split(':')
const payload = `${dateFormated[0]}:${dateFormated[1]} OffLine`

console.log(dateFormated)
console.log(payload)