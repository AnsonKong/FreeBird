module.exports = {
  delay (url) {
    var l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = url;
    l.type = 'text/css';
    var defer = document.getElementsByTagName('link')[0];
    defer.parentNode.insertBefore(l, defer);
  }
}