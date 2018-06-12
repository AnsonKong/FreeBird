'use strict'

const path = require('path')
const vfsUtil = require('../lib/VFSUtil')

module.exports = check

/**
 * double check if file exists in VFS, only for development
 * @param {Object} opts 
 */
function check(opts) {
  opts = opts || {}
  const vfs = 'vfs' in opts ? opts.vfs : null

  return async (ctx, next) => {
    await next()
    if (vfs && ctx.status === 404 && path.extname(ctx.path) !== '') {
      // check webpack memory file system
      let result = vfsUtil.extract(vfs, path.resolve(__dirname, '../public/', '.' + ctx.path.replace('/public', '')))
      if (result) {
        ctx.body = result
      }
    }
  }
}