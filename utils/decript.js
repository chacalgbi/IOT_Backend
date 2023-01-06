var bcrypt = require('bcryptjs')

module.exports = function log(pass, hash){
  return bcrypt.compareSync(pass, hash)
}