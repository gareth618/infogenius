export default function RandomNeedle(p5) {
  p5.setup = () => {
    p5.createCanvas(600, 300);
    p5.textAlign(p5.CENTER, p5.CENTER);
    p5.textFont('Consolas, Monaco, monospace');
    p5.strokeWeight(2);
    p5.cursor(p5.HAND);
  };

  let cx = 297.5;
  let dir = +1;
  let theta = 0;

  let xChosen = 1e9;
  let tChosen = 1e9;

  p5.draw = () => {
    p5.background(30);
    p5.noStroke();
    p5.fill(50);
    p5.textSize(10);
    p5.text('InfoGenius.ro', 37, p5.height - 5);
    p5.textSize(15);

    if (xChosen === 1e9) {
      cx += 2.5 * dir;
      if (cx === 447.5 || cx === 152.5)
        dir *= -1;

      p5.stroke(255, 69, 0);
      if (cx < 300) {
        p5.line(150, 150, cx, 150);
        p5.noStroke();
        p5.fill(255, 69, 0);
        p5.text('x', (150 + cx) / 2, 140);
      }
      else {
        p5.line(cx, 150, 450, 150);
        p5.noStroke();
        p5.fill(255, 69, 0);
        p5.text('x', (cx + 450) / 2, 140);
      }
    }

    p5.stroke(255);
    p5.line(150, 0, 150, 300);
    p5.line(450, 0, 450, 300);

    if (xChosen !== 1e9 && tChosen === 1e9)
      p5.line(cx, 0, cx, 300);

    p5.noStroke();
    if (tChosen === 1e9) {
      p5.fill(100, 149, 237);
      p5.circle(cx, 150, 10);
    }

    if (xChosen !== 1e9) {
      p5.fill(255, 69, 0);
      p5.text('x = ' + (xChosen / 300).toFixed(2) + 't', p5.width / 2, 260);

      if (tChosen === 1e9)
        theta += 0.05;
      else
        p5.text('θ = ' + tChosen.toFixed(2) + 'π', p5.width / 2, 280);

      p5.stroke(100, 149, 237);
      p5.translate(+cx, +150);
      p5.rotate(+theta);
      p5.line(-75, 0, +75, 0);
      p5.rotate(-theta);
      p5.translate(-cx, -150);

      if (tChosen === 1e9) {
        p5.noStroke();
        p5.fill(255, 69, 0);
        p5.text('θ', cx - 25, 150);
      }
    }
  };

  p5.mousePressed = () => {
    if (xChosen === 1e9)
      xChosen = (cx < 300 ? cx - 150 : 450 - cx);
    else if (tChosen === 1e9) {
      theta %= 2 * p5.PI;
      if (theta <= p5.PI / 2)
        tChosen = p5.PI / 2 - theta;
      else if (theta <= p5.PI)
        tChosen = theta - p5.PI / 2;
      else if (theta <= 3 * p5.PI / 2)
        tChosen = 3 * p5.PI / 2 - theta;
      else
        tChosen = theta - 3 * p5.PI / 2;
      tChosen /= p5.PI;
    }
    else {
      cx = 297.5;
      dir = +1;
      theta = 0;
      xChosen = 1e9;
      tChosen = 1e9;
    }
  };
};
