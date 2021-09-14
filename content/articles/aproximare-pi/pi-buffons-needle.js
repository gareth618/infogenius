export default function PiBuffonsNeedle(p5) {
  const BLACK = [17, 17, 17];
  const WHITE = [250, 235, 215];
  const RED = [255, 69, 0];
  const LENGTH = 300 / 4;

  let good = 0;
  let total = 0;

  const resetBackground = () => {
    p5.background(BLACK);
    p5.strokeWeight(2);
    p5.stroke(WHITE);
    for (let i = 0; i < 5; i++) {
      p5.line(i * LENGTH, 0, i * LENGTH, 300);
    }
    p5.noStroke();
    p5.strokeWeight(1);
  };

  p5.setup = () => {
    p5.createCanvas(300, 350);
    p5.frameRate(20);
    resetBackground();
    p5.textSize(15);
    p5.textFont('Source Code Pro');
    p5.textAlign(p5.CENTER, p5.CENTER);
  };

  p5.draw = () => {
    total++;
    const x = p5.random(0, 300);
    const y = p5.random(0, 300);
    const theta = p5.random(0, 2 * p5.PI);

    const x1 = x - LENGTH / 4 * p5.cos(theta);
    const y1 = y - LENGTH / 4 * p5.sin(theta);
    const x2 = x + LENGTH / 4 * p5.cos(theta);
    const y2 = y + LENGTH / 4 * p5.sin(theta);
    for (let i = 0; i < 5; i++) {
      good += p5.min(x1, x2) < i * LENGTH && i * LENGTH < p5.max(x1, x2);
    }
    p5.stroke(RED);
    p5.line(x1, y1, x2, y2);
    p5.noStroke();

    p5.fill(BLACK);
    p5.rect(0, 300, 300, 50);
    p5.fill(WHITE);
    p5.text('π aproximat:             ', p5.width / 2, 315);
    p5.text('     π real:             ', p5.width / 2, 335);
    p5.fill(RED);
    p5.text('             ' + (total / good).toFixed(10), p5.width / 2, 315);
    p5.text('             ' + p5.PI.toFixed(10), p5.width / 2, 335);
  };

  let paused = false;

  p5.mousePressed = () => {
    if (paused) {
      p5.loop();
      paused = false;
    }
    else {
      p5.noLoop();
      paused = true;
    }
  };

  p5.keyPressed = () => {
    if (!paused && p5.key.toLowerCase() === 'r') {
      good = 0;
      total = 0;
      resetBackground();
    }
  };
};
