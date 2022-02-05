export default function KochSnowflake(p5) {
  p5.setup = () => {
    p5.createCanvas(300, 370);
    p5.angleMode(p5.DEGREES);
    p5.noStroke();
  };

  p5.draw = () => {
    p5.background(30);
    p5.fill(255);
    p5.triangle(150, 45, 28, 255, 271, 255);

    p5.translate(+89, +150);
    p5.rotate(-60);
    paint(81, 1);
    p5.rotate(+60);
    p5.translate(-89, -150);

    p5.translate(+149.5, +255);
    p5.rotate(+180);
    paint(81, 1);
    p5.rotate(-180);
    p5.translate(-149.5, -255);

    p5.translate(+210.5, +150);
    p5.rotate(+60);
    paint(81, 1);
    p5.rotate(-60);
    p5.translate(-210.5, -150);
    p5.noLoop();
  };

  const paint = (len, it) => {
    if (it > MAX) return;
    p5.triangle(0, -0.86 * len, -len / 2, 0, +len / 2, 0);

    p5.translate(-len, 0);
    paint(len / 3, it + 1);
    p5.translate(+len, 0);

    p5.translate(-len / 4, -0.43 * len);
    p5.rotate(-60);
    paint(len / 3, it + 1);
    p5.rotate(+60);
    p5.translate(+len / 4, +0.43 * len);

    p5.translate(+len / 4, -0.43 * len);
    p5.rotate(+60);
    paint(len / 3, it + 1);
    p5.rotate(-60);
    p5.translate(-len / 4, +0.43 * len);

    p5.translate(+len, 0);
    paint(len / 3, it + 1);
    p5.translate(-len, 0);
  };

  let MAX = 0;
  p5.mousePressed = () => {
    if (p5.mouseX < p5.width / 2 && MAX > 0) MAX--;
    if (p5.mouseX > p5.width / 2 && MAX < 5) MAX++;
    p5.loop();
  };
};
