import CSanim from '@components/explicit/Sketch/csanim';

export default function Merge(p5) {
  const width = 30;
  const a = [1, 4, 5, 5, 7, 9];
  const b = [2, 3, 5, 6, 7];
  const csa = new CSanim((a.length + b.length) * (width + width / 5) - width / 5 + 2 * width, 5 * width);

  const squaresA = [];
  for (let i = 0; i < a.length; i++) {
    squaresA.push(new CSanim.Square(csa, [3 / 2 * width + i * (width + width / 5), 2 * width / 2], width));
    squaresA[i].text = a[i];
  }
  const squaresB = [];
  for (let i = 0; i < b.length; i++) {
    squaresB.push(new CSanim.Square(csa, [3 / 2 * width + i * (width + width / 5), 5 * width / 2], width));
    squaresB[i].text = b[i];
  }
  const squaresC = [];

  const textA = new CSanim.Text(csa, [width / 2, 2 * width / 2], 'a');
  const textB = new CSanim.Text(csa, [width / 2, 5 * width / 2], 'b');
  const textC = new CSanim.Text(csa, [width / 2, 8 * width / 2], 'c');

  const createSquare = square => {
    squaresC.push(new CSanim.Square(csa, [...square.position], width));
    const newSquare = squaresC[squaresC.length - 1];
    newSquare.text = square.text;
    newSquare.color = CSanim.RED;
    newSquare.show();
    csa.play([
      newSquare.changeColorTo(CSanim.GREEN),
      newSquare.moveTo([3 / 2 * width + (squaresC.length - 1) * (width + width / 5), 8 * width / 2])
    ], 1);
  };

  const next = (squares, ptr) => {
    const animation = [squares[ptr].changeColorTo(CSanim.YELLOW)];
    if (++ptr < squares.length) animation.push(squares[ptr].changeColorTo(CSanim.RED));
    csa.play(animation, .5);
  };

  const showAnimation = [];
  for (const square of squaresA) showAnimation.push(square.fadeIn());
  for (const square of squaresB) showAnimation.push(square.fadeIn());
  showAnimation.push(textA.fadeIn());
  showAnimation.push(textB.fadeIn());
  showAnimation.push(textC.fadeIn());
  csa.play(showAnimation, 1);
  csa.wait();

  let ptrA = 0;
  let ptrB = 0;
  while (ptrA < a.length && ptrB < b.length) {
    csa.play([
      squaresA[ptrA].changeColorTo(CSanim.RED),
      squaresB[ptrB].changeColorTo(CSanim.RED)
    ], .5);
    const text = new CSanim.Text(csa, [350, csa.h / 2], `${a[ptrA]} ${a[ptrA] < b[ptrB] ? '<' : '≥'} ${b[ptrB]}`);
    csa.play(text.fadeIn());
    csa.wait(1.5);
    csa.play(text.fadeOut());
    createSquare(a[ptrA] < b[ptrB] ? squaresA[ptrA] : squaresB[ptrB]);
    if (a[ptrA] < b[ptrB]) next(squaresA, ptrA++);
    else next(squaresB, ptrB++);
  }
  while (ptrA < a.length) { createSquare(squaresA[ptrA]); next(squaresA, ptrA++); }
  while (ptrB < b.length) { createSquare(squaresB[ptrB]); next(squaresB, ptrB++); }

  const rotateAnimation = [];
  squaresC.forEach((square, index) => {
    rotateAnimation.push(square.rotate().delay(index * .1));
  });
  csa.play(rotateAnimation, .5);
  csa.wait(3);
  csa.run(p5);
};
