var bcrypt = require('bcryptjs')

module.exports = function log(pass){
  return bcrypt.hashSync(pass, 8)
}