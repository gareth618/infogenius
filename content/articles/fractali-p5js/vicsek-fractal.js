export default function VicsekFractal(p5) {
  p5.setup = () => {
    p5.createCanvas(300, 300);
    p5.rectMode(p5.CENTER);
    p5.noStroke();
  };

  p5.draw = () => {
    p5.background(30);
    p5.fill(255);
    paint(p5.width / 2, p5.height / 2, 81, 0);
    p5.noLoop();
  };

  const paint = (cx, cy, len, it) => {
    if (it === MAX) {
      p5.rect(cx, cy, len * 3, len * 3);
      return;
    }
    paint(cx      , cy - len, len / 3, it + 1);
    paint(cx - len, cy      , len / 3, it + 1);
    paint(cx      , cy      , len / 3, it + 1);
    paint(cx + len, cy      , len / 3, it + 1);
    paint(cx      , cy + len, len / 3, it + 1);
  };

  let MAX = 0;
  p5.mousePressed = () => {
    if (p5.mouseX < p5.width / 2 && MAX > 0) MAX--;
    if (p5.mouseX > p5.width / 2 && MAX < 5) MAX++;
    p5.loop();
  };
};
