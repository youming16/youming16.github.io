
'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./remark-shiki-twoslash.cjs.production.min.js')
} else {
  module.exports = require('./remark-shiki-twoslash.cjs.development.js')
}
