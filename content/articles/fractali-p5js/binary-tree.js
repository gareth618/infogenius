export default function BinaryTree(p5) {
  p5.setup = () => {
    p5.createCanvas(500, 500);
    p5.angleMode(p5.DEGREES);
  };

  p5.draw = () => {
    p5.background(30);
    p5.stroke(255);
    p5.strokeWeight(11);
    p5.line(250, 460, 250, 360);
    paint(250, 360, 80, 229.5, 10, 15, 1);
    p5.noLoop();
  };

  const paint = (x, y, len, color, weight, angle, it) => {
    if (it > MAX) return;
    p5.translate(+x, +y);
    p5.rotate(-angle);
    p5.stroke(color);
    p5.strokeWeight(weight);
    p5.line(0, 0, 0, -len);
    paint(0, -len, len * 0.8, color * 0.9, weight - 1, angle * 1.1, it + 1);
    p5.rotate(+2 * angle);
    p5.stroke(color);
    p5.strokeWeight(weight);
    p5.line(0, 0, 0, -len);
    paint(0, -len, len * 0.8, color * 0.9, weight - 1, angle * 1.1, it + 1);
    p5.rotate(-angle);
    p5.translate(-x, -y);
  };

  let MAX = 0;
  p5.mousePressed = () => {
    if (p5.mouseX < p5.width / 2 && MAX > 0) MAX--;
    if (p5.mouseX > p5.width / 2 && MAX < 10) MAX++;
    p5.loop();
  };
};
