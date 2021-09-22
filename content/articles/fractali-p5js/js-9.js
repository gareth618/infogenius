export default function Js9(p5) {
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
        if (i === MAX) {
          p5.pixels[pixel + 0] = 0;
          p5.pixels[pixel + 1] = 0;
          p5.pixels[pixel + 2] = 0;
        }
        else {
          const rgb = getRGB(p5.floor(p5.map(i, 0, MAX, 0, 1535)));
          p5.pixels[pixel + 0] = rgb[0];
          p5.pixels[pixel + 1] = rgb[1];
          p5.pixels[pixel + 2] = rgb[2];
        }
        p5.pixels[pixel + 3] = 255;
      }
    }
    p5.updatePixels();
    p5.noLoop();
  };

  const getRGB = x => {
    if (p5.floor(x / 256) === 0) return [255, x % 256, 0];
    if (p5.floor(x / 256) === 1) return [255 - x % 256, 255, 0];
    if (p5.floor(x / 256) === 2) return [0, 255, x % 256];
    if (p5.floor(x / 256) === 3) return [0, 255 - x % 256, 255];
    if (p5.floor(x / 256) === 4) return [x % 256, 0, 255];
    if (p5.floor(x / 256) === 5) return [255, 0, 255 - x % 256];
  };
};
