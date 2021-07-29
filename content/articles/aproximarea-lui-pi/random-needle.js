function setup() {
  createCanvas(600, 300);
  textAlign(CENTER, CENTER);
  textFont('Consolas, Monaco, monospace');
  strokeWeight(2);
  cursor(HAND);
}

let cx = 297.5;
let dir = +1;
let theta = 0;

let xChosen = 1e9;
let tChosen = 1e9;

function draw() {
  background(30);
  noStroke();
  fill(50);
  textSize(10);
  text('InfoGenius.ro', 37, height - 5);
  textSize(15);

  if (xChosen === 1e9) {
    cx += 2.5 * dir;
    if (cx === 447.5 || cx === 152.5)
      dir *= -1;

    stroke(255, 69, 0);
    if (cx < 300) {
      line(150, 150, cx, 150);
      noStroke();
      fill(255, 69, 0);
      text('x', (150 + cx) / 2, 140);
    }
    else {
      line(cx, 150, 450, 150);
      noStroke();
      fill(255, 69, 0);
      text('x', (cx + 450) / 2, 140);
    }
  }

  stroke(255);
  line(150, 0, 150, 300);
  line(450, 0, 450, 300);

  if (xChosen !== 1e9 && tChosen === 1e9)
    line(cx, 0, cx, 300);

  noStroke();
  if (tChosen === 1e9) {
    fill(100, 149, 237);
    circle(cx, 150, 10);
  }

  if (xChosen !== 1e9) {
    fill(255, 69, 0);
    text('x = ' + (xChosen / 300).toFixed(2) + 't', width / 2, 260);

    if (tChosen === 1e9)
      theta += 0.05;
    else
      text('θ = ' + tChosen.toFixed(2) + 'π', width / 2, 280);

    stroke(100, 149, 237);
    translate(+cx, +150);
    rotate(+theta);
    line(-75, 0, +75, 0);
    rotate(-theta);
    translate(-cx, -150);

    if (tChosen === 1e9) {
      noStroke();
      fill(255, 69, 0);
      text('θ', cx - 25, 150);
    }
  }
}

function mousePressed() {
  if (xChosen === 1e9)
    xChosen = (cx < 300 ? cx - 150 : 450 - cx);
  else if (tChosen === 1e9) {
    theta %= 2 * PI;
    if (theta <= PI / 2)
      tChosen = PI / 2 - theta;
    else if (theta <= PI)
      tChosen = theta - PI / 2;
    else if (theta <= 3 * PI / 2)
      tChosen = 3 * PI / 2 - theta;
    else
      tChosen = theta - 3 * PI / 2;
    tChosen /= PI;
  }
  else {
    cx = 297.5;
    dir = +1;
    theta = 0;
    xChosen = 1e9;
    tChosen = 1e9;
  }
}
