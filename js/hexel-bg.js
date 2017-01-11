//ISSUES:
// 1. on mobile, scrolling and zooming are considered screen resizing
//    how to ignore scrolling. also, how do you not let the user
//    zoom out, cause it looks ugly

// image-rendering: -webkit-optimize-contrast !important;
// https://stackoverflow.com/questions/14270084/overflow-xhidden-doesnt-prevent-content-from-overflowing-in-mobile-browsers
// https://stackoverflow.com/questions/18268300/overflowhidden-not-working-on-mobile-browser
canvasMarginPercent = .25
canvasHeight = 700
canvasWidth = 0
hexels = []
okCollide = true
animated = true
bgc = [30,30,40]
fr = 10
hexProportion = .125
if (!okCollide) {
  hexProportion = .3
}
numHexelTries = 0
var canvas;
function setup() {
  frameRate(fr)
  //background(bgc[0],bgc[1],bgc[2]);
  // displayWidth
  // won't support multiple screens I guess
  numHexelTries = windowWidth/canvasHeight * (okCollide? 100:200)
  canvasWidth = displayWidth*(1+(canvasMarginPercent*2))
  canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent("canvasContainer")
  for (var i=0; i<numHexelTries; i++) {
    colliding = false;
    hexel = new Hexel()
    if (okCollide || hexelIsValid(hexel)) {
      hexels.push(hexel)
    }
  }
  // just for testing without draw
  if (!animated) {
    for (var i=0; i<hexels.length; i++) {
      draw_hexel(hexels[i]);
    }
  }
}
/*
window.onresize = function() {
  hexels = []
  setup()
  for (var i=0; i<hexels.length; i++) {
    hexels[i].y -= 700
    hexels[i].col[3]/=Math.random()*10+1
    hexels[i].col[3]+=hexels[i].deathTheshold
  }
}
*/

// comment out to test w/out animation
function draw() {

  for(var i=0; i<hexels.length; i++) {
    hexelTick(hexels[i])
    if (hexelIsDead(hexels[i])) {
      hexels.splice(i, 1)  // allow birth/death overlap
      do {
        hexel = new Hexel()
        if (okCollide) {
          break;
        }
      } while (!hexelIsValid(hexel));
      hexels.push(hexel);
    //   console.log('new hexel', hexel)
    }
  }
  clear()
  //background(bgc[0],bgc[1],bgc[2]);

  for (var i=0; i<hexels.length; i++) {
    draw_hexel(hexels[i]);
  }
}

function polygon(x, y, radius, npoints) {
  var angle = TWO_PI / npoints;
  beginShape();
  for (var a = 0; a < TWO_PI; a += angle) {
    var sx = x + cos(a) * radius;
    var sy = y + sin(a) * radius;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}

function Hexel() {
  var self = this;
  self.h2p = height * hexProportion;
  self.y = Math.random()*height-self.h2p;
  self.rad = self.h2p - Math.random()*self.h2p*(self.y/height);
  // Math.random()*(width-(self.rad*2))+self.rad
  self.x = Math.random()*windowWidth+(windowWidth*canvasMarginPercent)
  self.fade = (Math.random()*Math.random()*.01) * (30/fr)
  self.fadeIn = (Math.random()*Math.random()*.2) * (30/fr)
  self.col = [0,
              100+Math.random()*20-Math.random()*20,
              0,
              0]
  self.vx = 0
  self.vy = 0
  self.fx = 0
  self.fy = 0
  self.ax = 0
  self.ay = 0
  self.deathTheshold = 20
  self.opacity = Math.random()*(255-self.deathTheshold) * (height-self.y)/height + self.deathTheshold
  // self.isDead = false;
}
k = .9 / (30/fr)
// avoiding dealing with self issues
function hexelTick(h) {
  h.opacity *= 1-h.fade
  if (h.opacity > h.col[3]) {
    h.col[3] += h.fadeIn*(h.opacity-h.col[3])
  }
  else {
    h.col[3] = h.opacity
  }
  /*h.col[3] = Math.min(h.col[3], h.opacity)*/
  h.fx = -k*h.vx
  h.ax += (Math.random()-.5)*h.fade*h.rad * .1
  // (Math.random()-.5)*h.fade*h.rad*2
  h.vx += h.ax + h.fx
  h.fy = -k*h.vy
  h.ay = Math.random()*h.fade*20*(h.rad/h.h2p)
  // Math.random()*h.fade*20*(h.rad/h.h2p)
  h.vy += h.ay + h.fy
  h.x += h.vx
  h.y += h.vy
  // h.x += (Math.random()-.5)*h.fade*h.rad*2
  // h.y += Math.random()*h.fade*100*(h.rad/h.h2p)
  // h.rad *= 1-(Math.random()*h.fade)
  // h.fade *= 1.1
}

function hexelIsDead(h) {
  return h.opacity<=h.deathTheshold
}

function hexelIsValid(h) {
  for (var i=0; i<hexels.length; i++) {
    if (isColliding(h, hexels[i])) {
      return false
    }
  }
  return true
}

// pushes and pops
function draw_hexel(h) {
  push();
  noStroke();
  fill(h.col[0],h.col[1],h.col[2],h.col[3]);
  translate(h.x,h.y);
  rotate(.5239);
  polygon(0,0,h.rad,6);
  pop();
}

function isColliding(s1, s2) {
  var minDist = s1.rad + s2.rad
  return distance(s1,s2) <= minDist
}

function distance(p1, p2) {
  var dx = p2.x-p1.x
  var dy = p2.y-p1.y
  return sqrt(dx*dx + dy*dy)
}
