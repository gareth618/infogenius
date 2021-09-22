export default function Js2(p5) {
  p5.setup = () => {
    p5.createCanvas(300, 300);
  };

  p5.draw = () => {
    p5.background(20, 60, 220, 50);
    p5.fill(255, 255, 0);
    p5.circle(p5.mouseX, p5.mouseY, 50);
  };
};
