export default function MengerSponge(p5) {
  p5.setup = () => {
    p5.createCanvas(300, 300, p5.WEBGL);
    p5.noStroke();
  };

  p5.draw = () => {
    p5.background(30);
    p5.rotateX(p5.frameCount * 0.01);
    p5.rotateY(p5.frameCount * 0.01);
    p5.lights();
    p5.fill(255);
    paint(27, 0);
  };

  const paint = (len, it) => {
    if (it === MAX) {
      p5.box(len * 3);
      return;
    }
    for (let x = -len; x <= +len; x += len) {
      for (let y = -len; y <= +len; y += len) {
        for (let z = -len; z <= +len; z += len) {
          if (x === 0 && y === 0 && z === 0) continue;
          if (x === 0 && y === 0 && z !== 0) continue;
          if (x === 0 && y !== 0 && z === 0) continue;
          if (x !== 0 && y === 0 && z === 0) continue;
          p5.translate(+x, +y, +z);
          paint(len / 3, it + 1);
          p5.translate(-x, -y, -z);
        }
      }
    }
  };

  let MAX = 0;
  p5.mousePressed = () => {
    if (p5.mouseX < p5.width / 2 && MAX > 0) MAX--;
    if (p5.mouseX > p5.width / 2 && MAX < 3) MAX++;
    p5.loop();
  };
};
