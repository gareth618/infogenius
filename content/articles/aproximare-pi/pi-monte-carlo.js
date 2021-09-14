export default function PiMonteCarlo(p5) {
  const BLACK = [17, 17, 17];
  const WHITE = [250, 235, 215];
  const RED = [255, 69, 0];
  const RADIUS = 150;

  p5.setup = () => {
    p5.createCanvas(300, 350);
    p5.background(BLACK);
    p5.noStroke();
    p5.textSize(15);
    p5.textFont('Source Code Pro');
    p5.textAlign(p5.CENTER, p5.CENTER);
  };

  let inside = 0;
  let total = 0;

  p5.draw = () => {
    total++;
    const x = p5.random(0, 2 * RADIUS);
    const y = p5.random(0, 2 * RADIUS);

    p5.fill(WHITE);
    const sqrDist
      = (RADIUS - x) * (RADIUS - x)
      + (RADIUS - y) * (RADIUS - y);
    if (sqrDist <= RADIUS * RADIUS) {
      p5.fill(RED);
      inside++;
    }
    p5.circle(x, y, 3);

    p5.fill(BLACK);
    p5.rect(0, 300, 300, 50);
    p5.fill(WHITE);
    p5.text('π aproximat:             ', p5.width / 2, 315);
    p5.text('     π real:             ', p5.width / 2, 335);
    p5.fill(RED);
    p5.text('             ' + (4 * inside / total).toFixed(10), p5.width / 2, 315);
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
      inside = 0;
      total = 0;
      p5.fill(BLACK);
      p5.rect(0, 0, 300, 300);
    }
  };
};
