export default function SierpinskisTriangle(p5) {
  p5.setup = () => {
    p5.createCanvas(300, 300);
    p5.noStroke();
  };

  p5.draw = () => {
    p5.background(70);
    p5.fill(0);
    p5.triangle(150, 39, 22, 261, 278, 261);
    p5.fill(255);
    paint(150, 39, 22, 261, 278, 261, 1);
    p5.noLoop();
  };

  const paint = (x1, y1, x2, y2, x3, y3, it) => {
    if (it > MAX) return;
    const xMid1 = (x1 + x2) / 2, yMid1 = (y1 + y2) / 2;
    const xMid2 = (x2 + x3) / 2, yMid2 = (y2 + y3) / 2;
    const xMid3 = (x3 + x1) / 2, yMid3 = (y3 + y1) / 2;
    p5.triangle(xMid1, yMid1, xMid2, yMid2, xMid3, yMid3);
    paint(x1, y1, xMid1, yMid1, xMid3, yMid3, it + 1);
    paint(xMid1, yMid1, x2, y2, xMid2, yMid2, it + 1);
    paint(xMid3, yMid3, xMid2, yMid2, x3, y3, it + 1);
  };

  let MAX = 0;
  p5.mousePressed = () => {
    if (p5.mouseX < p5.width / 2 && MAX > 0) MAX--;
    if (p5.mouseX > p5.width / 2 && MAX < 8) MAX++;
    p5.loop();
  };
};
