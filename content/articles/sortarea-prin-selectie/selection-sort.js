import CSanim from '@components/explicit/Sketch/csanim';

export default function SelectionSort(p5) {
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
  for (let i = 0; i < array.length; i++) {
    let minPos = i;
    csa.play(squares[i].changeColorTo(CSanim.RED));
    for (let j = i + 1; j < array.length; j++) {
      csa.wait(.5);
      csa.play(squares[j].changeColorTo(CSanim.YELLOW));
      const text = new CSanim.Text(csa, textPosition, `${array[j]} ${array[j] < array[minPos] ? '<' : '≥'} ${array[minPos]}`);
      csa.play(text.fadeIn());
      csa.wait(1.5);
      csa.play(text.fadeOut());
      if (array[j] < array[minPos]) {
        csa.play([
          squares[minPos].changeColorTo(CSanim.WHITE),
          squares[j].changeColorTo(CSanim.RED)
        ]);
        minPos = j;
      }
      else {
        csa.play(squares[j].changeColorTo(CSanim.WHITE));
      }
    }
    csa.wait(.5);
    if (minPos === i) {
      csa.play(squares[i].changeColorTo(CSanim.GREEN));
    }
    else {
      csa.play([
        squares[minPos].moveUp(),
        squares[i].moveDown()
      ], .5);
      csa.play([
        squares[minPos].moveLeft(minPos - i),
        squares[i].moveRight(minPos - i)
      ], .5);
      csa.play([
        squares[minPos].moveDown(),
        squares[i].moveUp()
      ], .5);
      csa.play([
        squares[minPos].changeColorTo(CSanim.GREEN),
        squares[i].changeColorTo(CSanim.WHITE)
      ]);
      [array[i], array[minPos]] = [array[minPos], array[i]];
      [squares[i], squares[minPos]] = [squares[minPos], squares[i]];
    }
    csa.wait();
  }

  const rotateAnimation = [];
  squares.forEach((square, index) => {
    rotateAnimation.push(square.rotate().delay(index * .1));
  });
  csa.play(rotateAnimation, .5);
  csa.wait(3);
  csa.run(p5);
};
