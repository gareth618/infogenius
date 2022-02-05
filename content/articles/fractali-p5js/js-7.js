export default function Js7(p5) {
  let INF = 10;
  let MAX = 100;

  p5.setup = () => {
    p5.createCanvas(500, 500);
    p5.pixelDensity(1);
  };

  let cx = 0, cy = 0;
  let len = 5;

  p5.draw = () => {
    p5.loadPixels();
    for (let x = 0; x < p5.width; x++) {
      for (let y = 0; y < p5.height; y++) {
        const a0 = p5.map(x, 0, p5.width, cx - len, cx + len);
        const b0 = p5.map(y, 0, p5.height, cy - len, cy + len);

        let i = 0;
        for (let a = 0, b = 0; i < MAX; i++) {
          const aNow = a * a - b * b + a0;
          const bNow = 2 * a * b + b0;
          a = aNow;
          b = bNow;
          if (a * a + b * b >= INF * INF) break;
        }

        const pixel = (x + y * p5.width) * 4;
        p5.pixels[pixel + 0] = i === MAX ? 0 : 255;
        p5.pixels[pixel + 1] = i === MAX ? 0 : 255;
        p5.pixels[pixel + 2] = i === MAX ? 0 : 255;
        p5.pixels[pixel + 3] = 255;
      }
    }
    p5.updatePixels();
    p5.noLoop();
  };
};
