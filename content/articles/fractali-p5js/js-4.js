export default function Js4(p5) {
  p5.setup = () => {
    p5.createCanvas(300, 300, p5.WEBGL);
    p5.noStroke();
  };

  p5.draw = () => {
    p5.background(30);
    p5.fill(255);
    p5.box(50);
  };
};
