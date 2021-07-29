let inside = 0;
let total = 0;

function setup() {
  createCanvas(400, 500);
  background(0);
  noStroke();
  textSize(20);
  textFont('Consolas, Monaco, monospace');
  textAlign(CENTER, CENTER);
}

function draw() {
  const x = random(0, 400);
  const y = random(0, 400);
  total++;
  fill(250, 235, 215);
  if ((200 - x) * (200 - x) + (200 - y) * (200 - y) <= 40000) {
    fill(255, 69, 0);
    inside++;
  }
  circle(x, y, 5);
  fill(0);
  rect(0, 402.5, 400, 100);
  fill(250, 235, 215);
  text("π aproximat:                  ", width / 2, 440);
  text("     π real:                  ", width / 2, 470);
  fill(255, 69, 0);
  text("             " + (4 * inside / total).toFixed(15), width / 2, 440);
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
    inside = 0;
    total = 0;
    fill(0);
    rect(0, 0, 400, 402.5);
  }
}
