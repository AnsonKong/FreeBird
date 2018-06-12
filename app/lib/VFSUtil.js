'use strict'

const path = require('path')
const GlobalReg = require('./GlobalReg')

/**
 * extract files from Virtual FileSystem
 */
module.exports = {
  extract(fs, filePath) {
    let fileData

    if (fs.existsSync(filePath)) {
      const ext = path.extname(filePath).toLocaleLowerCase()
      let encoding;
      // Buffer(default) or String(txt extension)
      if (GlobalReg.txt.test(ext)) {
        encoding = 'utf-8'
      }
      fileData = fs.readFileSync(filePath, encoding)
    }
    return fileData
  }
}
