export default function RandomNeedle(p5) {
  const BLACK = [17, 17, 17];
  const WHITE = [250, 235, 215];
  const RED = [255, 69, 0];
  const BLUE = [100, 149, 237];

  p5.setup = () => {
    p5.createCanvas(400, 200);
    p5.textFont('Source Code Pro');
    p5.textAlign(p5.CENTER, p5.CENTER);
    p5.strokeWeight(2);
    p5.cursor(p5.HAND);
    p5.textSize(15);
  };

  let cx = 200;
  let dir = +1;
  let theta = 0;

  let xChosen = 1e9;
  let tChosen = 1e9;

  p5.draw = () => {
    p5.background(BLACK);
    if (xChosen === 1e9) {
      cx += 2 * dir;
      if (cx === 100 || cx === 300) dir *= -1;
      p5.fill(RED);
      p5.stroke(RED);
      if (cx < 200) {
        p5.line(100, 100, cx, 100);
        p5.noStroke();
        p5.text('x', (100 + cx) / 2, 85);
      }
      else {
        p5.line(cx, 100, 300, 100);
        p5.noStroke();
        p5.text('x', (cx + 300) / 2, 85);
      }
    }

    p5.stroke(WHITE);
    p5.line(100, 0, 100, 200);
    p5.line(300, 0, 300, 200);
    if (xChosen !== 1e9 && tChosen === 1e9) {
      p5.line(cx, 0, cx, 200);
    }
    p5.noStroke();
    if (tChosen === 1e9) {
      p5.fill(BLUE);
      p5.circle(cx, 100, 10);
    }

    if (xChosen !== 1e9) {
      p5.fill(RED);
      p5.text('x = ' + (xChosen / 200).toFixed(2) + 't', p5.width / 2, 170);
      if (tChosen === 1e9) theta += 0.05;
      else p5.text('θ = ' + tChosen.toFixed(2) + 'π', p5.width / 2, 190);

      p5.stroke(BLUE);
      p5.translate(+cx, +100);
      p5.rotate(+theta);
      p5.line(-50, 0, +50, 0);
      p5.rotate(-theta);
      p5.translate(-cx, -100);
      p5.noStroke();

      if (tChosen === 1e9) {
        p5.fill(RED);
        p5.text('θ', cx - 15, 100);
      }
    }
  };

  p5.mousePressed = () => {
    if (xChosen === 1e9) {
      xChosen = cx < 200 ? cx - 100 : 300 - cx;
    }
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
      cx = 200;
      dir = +1;
      theta = 0;
      xChosen = 1e9;
      tChosen = 1e9;
    }
  };
};
