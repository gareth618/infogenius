import CSanim from '@components/explicit/Sketch/csanim';

export default function TwoPointers1(p5) {
  const csa = new CSanim(500, 200);
  const array = [1, 3, 1, 9, 4, 5, 2, 5, 1, 7];
  const k = 8;

  const width = CSanim.getMaximumSize(array.length, csa.w - 100);
  const coordsX = CSanim.getEquidistantPoints(array.length, width, csa.w / 2);
  const height = width + 60;

  const squares = [];
  for (let i = 0; i < array.length; i++) {
    squares.push(new CSanim.Square(csa, [coordsX[i], (csa.h - height) / 2 + 55 + width / 2], width));
    squares[i].text = array[i];
    squares[i].textSize = 20;
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

  const arrowL = new CSanim.Line(csa, [squares[1].position[0] - 10 - width - width / 5, (csa.h - height) / 2], [squares[1].position[0] - 10 - width - width / 5, (csa.h - height) / 2 + 50]);
  const arrowR = new CSanim.Line(csa, [squares[0].position[0] + 10 - width - width / 5, (csa.h - height) / 2], [squares[0].position[0] + 10 - width - width / 5, (csa.h - height) / 2 + 50]);
  arrowL.arrow = true; arrowL.color = CSanim.YELLOW;
  arrowR.arrow = true; arrowR.color = CSanim.RED;
  csa.play([
    arrowL.fadeIn(),
    arrowL.zoomIn()
  ], 1);

  let l = 0, s = 0;
  for (let r = 0; r < array.length; r++) {
    const text = new CSanim.Text(csa, [csa.w / 2, csa.h - (csa.h - height) / 4], `${s} < ${k}`);
    csa.play(text.fadeIn());
    csa.wait(1.5);
    csa.play(text.fadeOut());
    s += array[r];
    const animation = [
      textS.changeTextTo(`s = ${s}`),
      squares[r].changeColorTo(CSanim.ORANGE)
    ];
    if (r === 0) {
      animation.push(arrowR.fadeIn());
      animation.push(arrowR.zoomIn());
    }
    animation.push(arrowR.animate('beg', [squares[r].position[0] + 10, (csa.h - height) / 2]));
    animation.push(arrowR.animate('end', [squares[r].position[0] + 10, (csa.h - height) / 2 + 50]));
    csa.play(animation, 1);

    while (s > k) {
      const text = new CSanim.Text(csa, [csa.w / 2, csa.h - (csa.h - height) / 4], `${s} > ${k}`);
      csa.play(text.fadeIn());
      csa.wait(1.5);
      csa.play(text.fadeOut());
      s -= array[l++];
      csa.play([
        textS.changeTextTo(`s = ${s}`),
        squares[l - 1].changeColorTo(CSanim.WHITE),
        arrowL.animate('beg', [squares[l].position[0] - 10, (csa.h - height) / 2]),
        arrowL.animate('end', [squares[l].position[0] - 10, (csa.h - height) / 2 + 50])
      ], 1);
    }

    if (s === k) {
      const text = new CSanim.Text(csa, [csa.w / 2, csa.h - (csa.h - height) / 4], `${s} = ${k}`);
      csa.play(text.fadeIn());
      csa.wait(1.5);
      csa.play(text.fadeOut());

      const hideAnimation = [
        textK.fadeOut(), arrowL.fadeOut(),
        textS.fadeOut(), arrowR.fadeOut()
      ];
      squares.slice(l, r + 1).forEach((square, index) => {
        hideAnimation.push(square.rotate().delay(index * .1));
      });
      csa.play(hideAnimation, 1);
      csa.wait(3);
      csa.run(p5);
      return;
    }
  }
};
