export default function Js3(p5) {
  p5.setup = () => {
    p5.createCanvas(300, 300);
  };

  p5.draw = () => {
    p5.fill(255, 255, 0);
    p5.circle(p5.mouseX, p5.mouseY, 50);
  };
};
