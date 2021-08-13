export default function PiBuffonsNeedle(p5) {
  let good = 0;
  let total = 0;

  const resetBackground = () => {
    p5.fill(0);
    p5.background(0);
    p5.stroke(250, 235, 215);
    p5.line(0, 0, 0, 400);
    p5.line(100, 0, 100, 400);
    p5.line(200, 0, 200, 400);
    p5.line(300, 0, 300, 400);
    p5.line(400, 0, 400, 400);
    p5.noStroke();
  };

  p5.setup = () => {
    p5.createCanvas(400, 500);
    resetBackground();
    p5.textSize(20);
    p5.textFont('Consolas, Monaco, monospace');
    p5.textAlign(p5.CENTER, p5.CENTER);
  };

  p5.draw = () => {
    const x1 = p5.random(-25, 425);
    const y1 = p5.random(-25, 425);
    const theta = p5.random(0, 2 * p5.PI);
    const x2 = x1 + 50 * p5.cos(theta);
    const y2 = y1 + 50 * p5.sin(theta);
    if (!(0 <= x1 + x2 && x1 + x2 <= 800)) return;
    if (!(0 <= y1 + y2 && y1 + y2 <= 800)) return;
    p5.stroke(255, 69, 0);
    p5.line(x1, y1, x2, y2);
    p5.noStroke();
    total++;
    if (p5.min(x1, x2) < 0 && 0 < p5.max(x1, x2)) good++;
    if (p5.min(x1, x2) < 100 && 100 < p5.max(x1, x2)) good++;
    if (p5.min(x1, x2) < 200 && 200 < p5.max(x1, x2)) good++;
    if (p5.min(x1, x2) < 300 && 300 < p5.max(x1, x2)) good++;
    if (p5.min(x1, x2) < 400 && 400 < p5.max(x1, x2)) good++;
    p5.fill(0);
    p5.rect(0, 400, 400, 100);
    p5.fill(250, 235, 215);
    p5.text("π aproximat:                  ", p5.width / 2, 440);
    p5.text("     π real:                  ", p5.width / 2, 470);
    p5.fill(255, 69, 0);
    p5.text("             " + (total / good).toFixed(15), p5.width / 2, 440);
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

  p5.keyPressed = () => {
    if (!paused && (p5.key === 'r' || p5.key === 'R')) {
      good = 0;
      total = 0;
      resetBackground();
    }
  };
};
