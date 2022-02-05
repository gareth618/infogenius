import CSanim from '@components/explicit/Sketch/csanim';

export default function BubbleSort(p5) {
  const csa = new CSanim(400, 200);
  const array = [4, 3, 7, 2, 5, 9, 8, 1, 3];

  const width = CSanim.getMaximumSize(array.length, 320);
  const coordsX = CSanim.getEquidistantPoints(array.length, width, csa.w / 2);
  const squares = [];
  for (let i = 0; i < array.length; i++) {
    squares.push(new CSanim.Square(csa, [coordsX[i], csa.h / 2], width));
    squares[i].text = array[i];
  }

  const showAnimation = [];
  squares.forEach((square, index) => {
    showAnimation.push(square.fadeIn().delay(index * .1));
  });
  csa.play(showAnimation, 1);
  csa.wait();

  const textPosition = [csa.w / 2, (200 - width) / 2 + width + (200 - width) / 4];
  let sorted;
  do {
    sorted = true;
    for (let i = 0; i < array.length - 1; i++) {
      csa.play([
        squares[i].changeColorTo(CSanim.YELLOW),
        squares[i + 1].changeColorTo(CSanim.YELLOW)
      ]);
      const text = new CSanim.Text(csa, textPosition, `${array[i]} ${array[i] > array[i + 1] ? '>' : '≤'} ${array[i + 1]}`);
      csa.play(text.fadeIn());
      csa.wait(1.5);
      csa.play(text.fadeOut());
      if (array[i] > array[i + 1]) {
        csa.play([
          squares[i].moveDown(),
          squares[i + 1].moveUp()
        ], .5);
        csa.play([
          squares[i].moveRight(),
          squares[i + 1].moveLeft()
        ], .5);
        csa.play([
          squares[i].moveUp(),
          squares[i + 1].moveDown()
        ], .5);
        [array[i], array[i + 1]] = [array[i + 1], array[i]];
        [squares[i], squares[i + 1]] = [squares[i + 1], squares[i]];
        sorted = false;
      }
      csa.play([
        squares[i].changeColorTo(CSanim.WHITE),
        squares[i + 1].changeColorTo(CSanim.WHITE)
      ]);
    }
  } while (!sorted);

  const rotateAnimation = [];
  squares.forEach((square, index) => {
    rotateAnimation.push(square.rotate().delay(index * .1));
    rotateAnimation.push(square.changeColorTo(CSanim.GREEN).delay(index * .1));
  });
  csa.play(rotateAnimation, .5);
  csa.wait(3);
  csa.run(p5);
};
