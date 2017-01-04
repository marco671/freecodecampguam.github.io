// image-rendering: -webkit-optimize-contrast !important;
hexels = []
function setup() {
  createCanvas(window.screen.width*1.5, 700);
  for (var i=0; i<200; i++) {
    colliding = false;
    hexel = new Hexel()
    if (true /*hexelIsValid(hexel)*/) {
      hexels.push(hexel)
    }
  }
  // just for testing without draw
  for (var i=0; i<hexels.length; i++) {
    draw_hexel(hexels[i]);
  }
}

// comment out to test w/out animation
function draw() {
  for(var i=0; i<hexels.length; i++) {
    hexelTick(hexels[i])
    if (hexelIsDead(hexels[i])) {
      do {
        valid = false;
        hexel = new Hexel()
        if(!hexelIsValid(hexel)) {
          valid = true;
        }
        valid = true;
      } while (!valid);
      hexels[i] = hexel;
      console.log('new hexel', hexel)
    }
  }
  clear()
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
  self.col = [0,100+random()*20-random()*20,0,random()*255]
  self.y = random()*(height*.8);
  self.rad = height/8 - random()*(height/8)*(self.y/height);
  self.x = random()*(width-(self.rad*2))+self.rad
  self.fade = (random()*random()*.01)
  // self.isDead = false;
}

// avoiding dealing with self issues
function hexelTick(h) {
  h.col[3] *= 1-h.fade
  h.x += (random()-.5)*h.fade*h.rad
  h.y += random()*h.fade*100*(h.rad/(height/8))
  h.rad *= 1-(random()*h.fade)
  // h.fade *= 1.1
}

function hexelIsDead(h) {
  return h.col[3]<=5
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
