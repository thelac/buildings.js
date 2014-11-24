'use strict';

app.factory('three', function($http, $log, $rootScope) {

  var demo;
  var canvas = document.getElementById('main');

  function init(params) {
    demo = new Demo.Scene(params);
    animate();
  }

  function animate() {
    requestAnimationFrame(animate);
    render();
    if (demo.scene.children.length > 0 && demo.controls.enabled) {
      demo.checkPicker();
    }
  }



  function render() {
    demo.renderer.render(demo.scene, demo.camera);
    demo.controls.update();
  }

  function load(url, mtlurl, options) {
    var loader = new THREE.UTF8Loader();
    loader.load(url, function(object) {
      object.traverse(function(child) {
        if (child instanceof THREE.Mesh) {
          child.material.emissive.setRGB(1, 1, 1);
          child.rotation.x = -Math.PI / 2;

          if (child.material.name.indexOf('glass') != -1) {
            child.material.transparent = true;
            child.material.renderDepth = -1.1;
            child.material.opacity = 0.2;
          } else if (child.material.name.indexOf('street_names') != -1) {
            child.material.transparent = true;
            child.material.renderDepth = -1.1;
          }
        }
      });

      demo.scene.add(object);
    });
  }

  function parseFileFromUrl(url) {
    return url.split('/').slice(-1)[0].split('.')[0];
  }

  function loadGroups(url, callback) {
    $.getJSON(url, function(groups) {
      config.groups = groups;
      callback(groups);
    });
  }

  // function loadCards(url, callback) {
  //   var loader = new THREE.OBJLoader();
  //   $.getJSON(url, function(data) {
  //     config.cards.info = data;
  //     var cards = window.location.hash.substring(1).split(';');

  //     for (var i = 0; i < data.length; i++) {
  //       loader.load(config.baseUrl + data[i].url, (function(url) {
  //         return function(object) {
  //           object = object.children[0];
  //           object.material.emissive.setRGB(0, 0, 5);
  //           object.material.transparent = true;
  //           object.material.renderDepth = -1.1;
  //           object.material.opacity = 0.4;

  //           object.rotation.x = -Math.PI / 2;

  //           object.material.side = THREE.DoubleSide;

  //           object.name = parseFileFromUrl(url);
  //           object.visible = cards.indexOf(object.name) > -1;
  //           demo.cards.push(object);
  //           demo.scene.add(object);
  //         }
  //       })(data[i].url))
  //     }
  //     callback(config.cards.info.map(function(curr, i, a) {
  //       var cards = window.location.hash.substring(1).split(';');
  //       var selected = false;
  //       var name = parseFileFromUrl(curr.url);
  //       for (var i = 1; i < cards.length; i++)
  //         if (name == cards[i]) selected = true;
  //       return {
  //         "name": name,
  //         "selected": selected
  //       };
  //     }));
  //     demo.showInfo();
  //   });
  // }
  function loadCards(data) {
    var loader = new THREE.OBJLoader();
    config.cards.info = data;
    var cards = window.location.hash.substring(1).split(';');

    for (var i = 0; i < data.length; i++) {
      loader.load(config.baseUrl + data[i].url, (function(url, availability) {
        return function(object) {
          object = object.children[0];
          switch(availability) {
            case "Available":
              object.material.emissive.setRGB(90 / 255, 200 / 255, 121 / 255);
              break;
            case "Partial":
              object.material.emissive.setRGB(81 / 255,81 / 255,  215 / 255);
              break;
            case "Leased":
              object.material.emissive.setRGB(215 / 255, 81 / 255, 81 / 255);
              break;
            default:
              object.material.emissive.setRGB(90 / 255, 150 / 255, 121 / 255);
              break;
          }
          object.material.transparent = true;
          object.material.renderDepth = -1.1;
          object.material.opacity = 0.6;

          object.rotation.x = -Math.PI / 2;

          object.material.side = THREE.DoubleSide;

          object.name = parseFileFromUrl(url);
          object.visible = cards.indexOf(object.name) > -1;
          demo.cards.push(object);
          demo.scene.add(object);
        };
      })(data[i].url, data[i].availability))
    }
    return config.cards.info.map(function(curr, i, a) {
      var cards = window.location.hash.substring(1).split(';');
      var selected = false;
      var name = parseFileFromUrl(curr.url);
      for (var i = 1; i < cards.length; i++)
        if (name == cards[i]) selected = true;
      return {
        "name": name,
        "selected": selected
      };
    });
  }

  function screenshot(filename) {
    demo.screenshot(filename);
  }

  function onCardClick(card) {
    demo.addCardToUrl(card.name);
  }

  function showInfo(callback) {
    demo.showInfo(callback);
  }

  function onMouseUp() {
    return demo.onMouseUp();
  }
  return {
    init: init,
    load: load,
    loadCards: loadCards,
    screenshot: screenshot,
    onCardClick: onCardClick,
    onMouseUp: onMouseUp,
    loadGroups: loadGroups,
    showInfo: showInfo
  };
});