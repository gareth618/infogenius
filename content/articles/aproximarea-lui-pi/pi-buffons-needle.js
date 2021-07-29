let good = 0;
let total = 0;

function resetBackground() {
  fill(0);
  background(0);
  stroke(250, 235, 215);
  line(0, 0, 0, 400);
  line(100, 0, 100, 400);
  line(200, 0, 200, 400);
  line(300, 0, 300, 400);
  line(400, 0, 400, 400);
  noStroke();
}

function setup() {
  createCanvas(400, 500);
  resetBackground();
  textSize(20);
  textFont('Consolas, Monaco, monospace');
  textAlign(CENTER, CENTER);
}

function draw() {
  const x1 = random(-25, 425);
  const y1 = random(-25, 425);
  const theta = random(0, 2 * PI);
  const x2 = x1 + 50 * cos(theta);
  const y2 = y1 + 50 * sin(theta);
  if (!(0 <= x1 + x2 && x1 + x2 <= 800)) return;
  if (!(0 <= y1 + y2 && y1 + y2 <= 800)) return;
  stroke(255, 69, 0);
  line(x1, y1, x2, y2);
  noStroke();
  total++;
  if (min(x1, x2) < 0 && 0 < max(x1, x2)) good++;
  if (min(x1, x2) < 100 && 100 < max(x1, x2)) good++;
  if (min(x1, x2) < 200 && 200 < max(x1, x2)) good++;
  if (min(x1, x2) < 300 && 300 < max(x1, x2)) good++;
  if (min(x1, x2) < 400 && 400 < max(x1, x2)) good++;
  fill(0);
  rect(0, 400, 400, 100);
  fill(250, 235, 215);
  text("π aproximat:                  ", width / 2, 440);
  text("     π real:                  ", width / 2, 470);
  fill(255, 69, 0);
  text("             " + (total / good).toFixed(15), width / 2, 440);
  text("             " + PI, width / 2, 470);
}

let paused = false;

function mousePressed() {
  if (paused) {
    loop();
    paused = false;
  }
  else {
    noLoop();
    paused = true;
  }
}

function keyTyped() {
  if (!paused && (key === 'r' || key === 'R')) {
    good = 0;
    total = 0;
    resetBackground();
  }
}
