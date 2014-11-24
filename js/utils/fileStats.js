FileStats = function() {};

FileStats.prototype.constructor = FileStats;

FileStats.prototype.getSize = function(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open('HEAD', url, true);

  xhr.onreadystatechange = function() {
    if (this.readyState == this.DONE) {
      callback(parseInt(xhr.getResponseHeader('Content-Length')));
    }
  };
  xhr.send();
}