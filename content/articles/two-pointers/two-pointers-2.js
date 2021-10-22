import CSanim from '@components/explicit/Sketch/csanim';

export default function TwoPointers2(p5) {
  const csa = new CSanim(500, 200);
  const array = [1, 1, 4, 7, 13, 18, 23, 30, 42, 45];
  const k = 36;

  const width = CSanim.getMaximumSize(array.length, csa.w - 100);
  const coordsX = CSanim.getEquidistantPoints(array.length, width, csa.w / 2);
  const height = width + 60;

  const squares = [];
  for (let i = 0; i < array.length; i++) {
    squares.push(new CSanim.Square(csa, [coordsX[i], (csa.h - height) / 2 + 55 + width / 2], width));
    squares[i].text = array[i];
    squares[i].textSize = 15;
  }

  const showAnimation = [];
  squares.forEach((square, index) => {
    showAnimation.push(square.fadeIn().delay(index * .1));
  });
  csa.play(showAnimation, 1);

  const textK = new CSanim.Text(csa, [150, (csa.h - height) / 4], `k = ${k}`);
  textK.textColor = CSanim.RED;
  textK.textSize = 20;
  const textS = new CSanim.Text(csa, [csa.w - 150, (csa.h - height) / 4], `s = 0`);
  textS.textColor = CSanim.YELLOW;
  textS.textSize = 20;
  csa.play([
    textK.fadeIn(),
    textS.fadeIn()
  ], 1);

  const arrowL = new CSanim.Line(csa, [squares[               0].position[0], (csa.h - height) / 2], [squares[               0].position[0], (csa.h - height) / 2 + 50]);
  const arrowR = new CSanim.Line(csa, [squares[array.length - 1].position[0], (csa.h - height) / 2], [squares[array.length - 1].position[0], (csa.h - height) / 2 + 50]);
  arrowL.arrow = true; arrowL.color = CSanim.YELLOW;
  arrowR.arrow = true; arrowR.color = CSanim.RED;
  csa.play([
    arrowL.fadeIn(), arrowL.zoomIn(),
    arrowR.fadeIn(), arrowR.zoomIn(),
    squares[0].changeColorTo(CSanim.ORANGE),
    squares[array.length - 1].changeColorTo(CSanim.ORANGE)
  ], 1);

  let l = 0, r = array.length - 1;
  while (l < r) {
    csa.play(textS.changeTextTo(`s = ${array[l] + array[r]}`), 1);
    if (array[l] + array[r] === k) {
      const text = new CSanim.Text(csa, [csa.w / 2, csa.h - (csa.h - height) / 4], `${array[l] + array[r]} = ${k}`);
      csa.play(text.fadeIn());
      csa.wait(1.5);
      csa.play(text.fadeOut());

      csa.play([
        textK.fadeOut(), arrowL.fadeOut(),
        textS.fadeOut(), arrowR.fadeOut(),
        squares[l].rotate(),
        squares[r].rotate()
      ], 1);
      csa.wait(3);
      csa.run(p5);
      return;
    }
    else if (array[l] + array[r] < k) {
      const text = new CSanim.Text(csa, [csa.w / 2, csa.h - (csa.h - height) / 4], `${array[l] + array[r]} < ${k}`);
      csa.play(text.fadeIn());
      csa.wait(1.5);
      csa.play(text.fadeOut());

      l++;
      csa.play([
        squares[l - 1].changeColorTo(CSanim.WHITE),
        squares[l].changeColorTo(CSanim.ORANGE),
        arrowL.animate('beg', [squares[l].position[0], (csa.h - height) / 2]),
        arrowL.animate('end', [squares[l].position[0], (csa.h - height) / 2 + 50])
      ], 1);
    }
    else {
      const text = new CSanim.Text(csa, [csa.w / 2, csa.h - (csa.h - height) / 4], `${array[l] + array[r]} > ${k}`);
      csa.play(text.fadeIn());
      csa.wait(1.5);
      csa.play(text.fadeOut());

      r--;
      csa.play([
        squares[r + 1].changeColorTo(CSanim.WHITE),
        squares[r].changeColorTo(CSanim.ORANGE),
        arrowR.animate('beg', [squares[r].position[0], (csa.h - height) / 2]),
        arrowR.animate('end', [squares[r].position[0], (csa.h - height) / 2 + 50])
      ], 1);
    }
  }
};
