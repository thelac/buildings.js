THREE.ImageLoader = function(manager) {

  this.manager = (manager !== undefined) ? manager : THREE.DefaultLoadingManager;

};

THREE.ImageLoader.prototype = {

  constructor: THREE.ImageLoader,

  load: function(url, onLoad, onProgress, onError) {

    var scope = this;
    var image = document.createElement('img');

    if (onLoad !== undefined) {

      image.addEventListener('load', function(event) {

        scope.manager.itemEnd(url);
        onLoad(this);

      }, false);

    }

    if (onProgress !== undefined) {

      image.addEventListener('progress', function(event) {

        onProgress(event);

      }, false);

    }

    if (onError !== undefined) {

      image.addEventListener('error', function(event) {

        onError(event);

      }, false);

    }

    if (this.crossOrigin !== undefined) image.crossOrigin = this.crossOrigin;

    image.src = url;

    image.onload = function() {
      var fileStats = new FileStats();
      fileStats.getSize(url, function(size) {
        radio('progress').broadcast(url, size)
      });
    };

    scope.manager.itemStart(url);

    return image;

  },

  setCrossOrigin: function(value) {

    this.crossOrigin = value;

  }
}