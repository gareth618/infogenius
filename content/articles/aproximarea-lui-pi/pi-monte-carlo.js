export default function PiMonteCarlo(p5) {
  let inside = 0;
  let total = 0;

  p5.setup = () => {
    p5.createCanvas(400, 500);
    p5.background(0);
    p5.noStroke();
    p5.textSize(20);
    p5.textFont('Consolas, Monaco, monospace');
    p5.textAlign(p5.CENTER, p5.CENTER);
  };

  p5.draw = () => {
    const x = p5.random(0, 400);
    const y = p5.random(0, 400);
    total++;
    p5.fill(250, 235, 215);
    if ((200 - x) * (200 - x) + (200 - y) * (200 - y) <= 40000) {
      p5.fill(255, 69, 0);
      inside++;
    }
    p5.circle(x, y, 5);
    p5.fill(0);
    p5.rect(0, 402.5, 400, 100);
    p5.fill(250, 235, 215);
    p5.text("π aproximat:                  ", p5.width / 2, 440);
    p5.text("     π real:                  ", p5.width / 2, 470);
    p5.fill(255, 69, 0);
    p5.text("             " + (4 * inside / total).toFixed(15), p5.width / 2, 440);
    p5.text("             " + p5.PI, p5.width / 2, 470);
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

  p5.keyTyped = () => {
    if (!paused && (p5.key === 'r' || p5.key === 'R')) {
      inside = 0;
      total = 0;
      p5.fill(0);
      p5.rect(0, 0, 400, 402.5);
    }
  };
};
