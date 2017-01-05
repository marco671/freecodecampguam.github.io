// image-rendering: -webkit-optimize-contrast !important;
hexels = []
okCollide = true
animated = true
bgc = [30,30,40]
fr = 10
function setup() {
  frameRate(fr)
  background(bgc[0],bgc[1],bgc[2]);
  // displayWidth
  createCanvas(windowWidth*1.5, 700);
  for (var i=0; i<200; i++) {
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
window.onresize = function() {
  hexels = []
  setup()
  for (var i=0; i<hexels.length; i++) {
    hexels[i].y -= 700
    hexels[i].col[3]/=Math.random()*5+1
    hexels[i].col[3]+=hexels[i].deathTheshold
  }
}

// comment out to test w/out animation
function draw() {

  for(var i=0; i<hexels.length; i++) {
    hexelTick(hexels[i])
    if (hexelIsDead(hexels[i])) {
      do {
        hexel = new Hexel()
        if (okCollide) {
          break;
        }
      } while (!hexelIsValid(hexel));
      hexels[i] = hexel;
      console.log('new hexel', hexel)
    }
  }
  clear()
  background(bgc[0],bgc[1],bgc[2]);

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
  self.y = Math.random()*height-(height*.2);
  self.rad = height/8 - Math.random()*(height/8)*(self.y/height);
  self.x = Math.random()*(width-(self.rad*2))+self.rad
  self.fade = (Math.random()*Math.random()*.01) * (30/fr)
  self.col = [0,
              100+Math.random()*20-Math.random()*20,
              0,
              Math.random()*255 * (height-self.y)/height]
  self.vx = 0
  self.vy = 0
  self.fx = 0
  self.fy = 0
  self.ax = 0
  self.ay = 0
  self.deathTheshold = 5
  // self.isDead = false;
}
k = .9
// avoiding dealing with self issues
function hexelTick(h) {
  h.col[3] *= 1-h.fade
  h.fx = -k*h.vx
  h.ax += (Math.random()-.5)*h.fade*h.rad * .1
  // (Math.random()-.5)*h.fade*h.rad*2
  h.vx += h.ax + h.fx
  h.fy = -k*h.vy
  h.ay = Math.random()*h.fade*20*(h.rad/(height/8))
  // Math.random()*h.fade*20*(h.rad/(height/8))
  h.vy += h.ay + h.fy
  h.x += h.vx
  h.y += h.vy
  // h.x += (Math.random()-.5)*h.fade*h.rad*2
  // h.y += Math.random()*h.fade*100*(h.rad/(height/8))
  // h.rad *= 1-(Math.random()*h.fade)
  // h.fade *= 1.1
}

function hexelIsDead(h) {
  return h.col[3]<=h.deathTheshold
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
