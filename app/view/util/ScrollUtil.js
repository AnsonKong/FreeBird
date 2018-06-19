module.exports = {
  stopScroll () {
    document.body.style['overflow'] = 'hidden'
  },
  startScroll () {
    document.body.style['overflow'] = 'auto'
  }
}
