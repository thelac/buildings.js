'use strict';

app.directive('overlay', function() {
  return {
    restrict: 'E',
    link: function(scope, element) {
      var message = document.createElement('div');
      message.id = 'overlay-message';

      var messageText = document.createElement('p');
      messageText.innerHTML = 'Click and drag to look. Scroll to zoom. Click the left icon for highlights.<br />To view this space in 3D, please use a browser that supports <a href="http://get.webgl.org" target="_blank">WebGL</a>.';
      message.appendChild(messageText);

      element.append(message);

      var close = document.createElement('div');
      close.id = 'overlay-close';

      element.append(close);

      $('#overlay-close').click(function() {
        $('overlay').css('visibility', function(index) {
          return 'hidden';
        });
      })
    }
  };
});

app.directive('screenshot', function(three) {
  return {
    restrict: 'E',
    link: function(scope, element) {

      $('screenshot').click(function() {
        three.screenshot('screenshot.jpg');
      });
      // $('canvas').click(function() {
      //   // var infoDiv = document.getElementsByTagName('unitInfo')[0];
      //   three.onMouseUp();
      //   // infoDiv.style.visibility = "hidden";
      // });
    }
  };
});

// app.directive('panel', function(three) {
//   return {
//     restrict: 'E',
//     link: function(scope, element) {

//     }
//   };
// });