var Demo = Demo || {};
var justClicked;
var onDocumentMouseMove = function(mouse2D, event) {
  event.preventDefault();
  // Convert eventX and eventY to mouse2D
  var clientX = event.clientX;
  var clientY = event.clientY;

  mouse2D.x = (clientX / window.innerWidth) * 2 - 1;
  mouse2D.y = -(clientY / window.innerHeight) * 2 + 1;

}

function onMouseUp() {
  var intersects = getIntersects(this.camera, this.mouse2D.clone(), this.scene.children);

  if (intersects.length > 0) {
    this.addCardToUrl(intersects[0].object.name);
    var object = this.scene.getObjectByName(intersects[0].object.name);
    justClicked = object;
    return intersects[0].object.name
  }
}

function showInfo() {
  var cards = window.location.hash.substring(1).split(';');
  var infoDiv = document.getElementsByTagName('unitInfo')[0];
  infoDiv.style.visibility = "visible";
  infoDiv.className = "";
  var total = 0;
  var html = "";
  for (var i = 1, pickedCardsLen = cards.length; i < pickedCardsLen; i++) {
    var card;
    for (var j = 0, totalLen = config.cards.info.length; j < totalLen; j++) {
      if (config.cards.data[j].name == cards[i]) {
        card = config.cards.info[j];
        total += parseInt(card.size);
        html += "Unit: " + cards[i] + "</br>Size: " + parseInt(card.size).formatComma() + " sf</br>Availability: " + card.availability + "</br></br>";
      }
    }
  }

  if (html != "") {
    var totalHTML = "Total: " + parseInt(total).formatComma() + " sf </br></br></br>";
    infoDiv.innerHTML = html + totalHTML;
  } else {
    infoDiv.className = "closed";
    setTimeout(function() { //wait for the effect finish
      infoDiv.innerHTML = "";
      infoDiv.style.visibility = "hidden";
    }, 300)
  }
}

function getIntersects(camera, mouse, children) {
  var projector = new THREE.Projector();
  var raycasters = projector.pickingRay(mouse, camera);
  return (raycasters.intersectObjects(children));
}

Demo.Scene = function(params) {

  this.container = document.getElementById(params.canvasId);
  this.jqContainer = $('#' + params.canvasId);

  // rays for casting.
  this.rays = [];
  // Cards geometries representing units
  this.cards = [];

  // an array of scene elements we're interested in colliding with.  the X's and O's.
  this.collisions = [];

  this.scene = null;
  this.projector = null;
  this.renderer = null;
  this.setup = null;
  this.camera = null;
  this.controls = null;
  this.init();

};

Demo.Scene.prototype = {

  init: function() {
    var params = {
      context: this
    };
    this.scene = new THREE.Scene();
    this.projector = new THREE.Projector();
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.container,
      antialias: true,
      preserverDrawingBuffer: true
    });

    this.renderer.setClearColor(new THREE.Color(config.backgroundColor), 1.0);
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    var aspect = window.innerWidth / window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(60, aspect, 1, 100000);
    this.camera.position.z = config.zoomDistance.init;
    // this.setup = new Demo.Scene.Setup(params);
    // this.controls = new THREE.OrbitControls(this.cameras.liveCam, this.container);

    this.listeners();

    this.controls = new THREE.OrbitControls(this.camera, this.container);

    this.mouse2D = new THREE.Vector3(0, 10000, 0.5);
    var that = this;
    this.renderer.domElement.addEventListener('mousemove', function(e) {
      onDocumentMouseMove(that.mouse2D, e)
    }, false);
  },

  listeners: function() {
    var that = this;
    $(window).resize(that.onWindowResize.bind(that));
  },

  onWindowResize: function() {
    var aspect = window.innerWidth / window.innerHeight;
    this.camera.aspect = aspect;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  },

  screenshot: function(filename) {
    this.renderer.render(this.scene, this.camera);
    var uri = this.renderer.domElement.toDataURL('image/jpeg');
    var temp = document.createElement('temp');
    temp.style.backgroundImage = "url('" + uri + "')";
    temp.style.backgroundSize = window.innerWidth +"px " + window.innerHeight+"px";
    temp.style.position = "absolute";
    temp.style.width = "100%";
    temp.style.height = "100%";
    temp.style.top = 0;
    temp.style.left = 0;
    document.body.appendChild(temp);
    //work around for html2canvas
    html2canvas(document.body, {
      onrendered: function(canvas) {

        var img = uriToBlob(canvas.toDataURL());
        img.type = 'image/jpeg';
        saveAs(img, filename);
        // window.open(img);

        document.body.removeChild(temp);
        // console.log(uri)
        // var img = uriToBlob(uri);
        // img.type = 'image/jpeg';
        // saveAs(img, filename);
      },
      height: window.innerHeight
    });
  },
  checkPicker: function() {
    var intersects = getIntersects(this.camera, this.mouse2D.clone(), this.scene.children);
    var cards = window.location.hash.substring(1).split(';');
    for (var each in this.scene.children) {
      if (this.scene.children[each].name !== "" && cards.indexOf(this.scene.children[each].name) == -1) this.scene.children[each].visible = false;
      else this.scene.children[each].visible = true;
    }
    if (intersects && intersects.length > 0) {
      var object = this.scene.getObjectByName(intersects[0].object.name);
      if (justClicked == object) {
        return;
      }
      object.visible = true;
      justClicked = null;
    }

  },
  addCardToUrl: function(card) {
    var hash = window.location.hash.substring(1);

    var cards = hash.split(';')
    var index = cards.indexOf(card);

    if (index > -1) { //if there is the card in url
      cards.splice(index, 1);
    } else {
      cards.push(card);
    }
    window.location.hash = cards.join(';');
    showInfo();
  },
  showInfo: showInfo,
  onMouseUp: onMouseUp
};