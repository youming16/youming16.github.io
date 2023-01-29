
'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./fenceparser.cjs.production.min.js')
} else {
  module.exports = require('./fenceparser.cjs.development.js')
}
