import CSanim from '@components/explicit/Sketch/csanim';

export default function InsertionSort(p5) {
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
  for (let i = 1; i < array.length; i++) {
    csa.play([
      squares[i].changeColorTo(CSanim.RED),
      squares[i].moveUp()
    ], .5);

    const temp = array[i];
    let j;
    for (j = i; j > 0 && array[j - 1] > temp; j--) {
      csa.play(squares[j - 1].changeColorTo(CSanim.YELLOW));
      const text = new CSanim.Text(csa, textPosition, `${array[j - 1]} > ${temp}`);
      csa.play(text.fadeIn());
      csa.wait(1.5);
      csa.play(text.fadeOut());
      csa.play([
        squares[j - 1].changeColorTo(CSanim.GREEN),
        squares[j - 1].moveRight()
      ], .5);
      array[j] = array[j - 1];
    }
    if (j > 0) {
      csa.play(squares[j - 1].changeColorTo(CSanim.YELLOW));
      const text = new CSanim.Text(csa, textPosition, `${array[j - 1]} ≤ ${temp}`);
      csa.play(text.fadeIn());
      csa.wait(1.5);
      csa.play(text.fadeOut());
      csa.play(squares[j - 1].changeColorTo(CSanim.GREEN));
    }
    array[j] = temp;

    csa.play(squares[i].moveLeft(i - j), .5);
    csa.play([
      squares[i].changeColorTo(CSanim.GREEN),
      squares[i].moveDown()
    ], .5);
    csa.wait();
    squares.sort((a, b) => a.position[0] - b.position[0]);
  }

  const rotateAnimation = [];
  squares.forEach((square, index) => {
    rotateAnimation.push(square.rotate().delay(index * .1));
  });
  csa.play(rotateAnimation, .5);
  csa.wait(3);
  csa.run(p5);
};
