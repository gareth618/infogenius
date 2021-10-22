import CSanim from '@components/explicit/Sketch/csanim';

export default function TwoPointers3(p5) {
  const csa = new CSanim(500, 130);
  const array = [0, 1, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1];

  const width = CSanim.getMaximumSize(array.length, csa.w - 50);
  const coordsX = CSanim.getEquidistantPoints(array.length, width, csa.w / 2);
  const squares = [];
  for (let i = 0; i < array.length; i++) {
    squares.push(new CSanim.Square(csa, [coordsX[i], csa.h / 2], width));
    squares[i].text = array[i];
  }

  const showAnimation = [];
  squares.forEach((square, index) => {
    showAnimation.push(square.fadeIn().delay(index * .05));
  });
  csa.play(showAnimation, .5);

  let l = 0, r = array.length - 1;
  csa.play([
    squares[l].changeColorTo(CSanim.RED),
    squares[r].changeColorTo(CSanim.RED)
  ], .5);

  while (l < r) {
    csa.wait(1.5);
    if (array[l] === 1 && array[r] === 0) {
      csa.play([
        squares[l].moveDown(),
        squares[r].moveUp()
      ], .5);
      csa.play([
        squares[l].moveRight(r - l),
        squares[r].moveLeft(r - l)
      ], .5);
      csa.play([
        squares[l].moveUp(),
        squares[r].moveDown()
      ], .5);
      const animation = [
        squares[l].changeColorTo(CSanim.GREEN),
        squares[r].changeColorTo(CSanim.GREEN)
      ];
      if (l + 1 <= r - 1) animation.push(squares[l + 1].changeColorTo(CSanim.RED));
      if (l + 1 <  r - 1) animation.push(squares[r - 1].changeColorTo(CSanim.RED));
      csa.play(animation, .5);
      l++;
      r--;
    }
    else if (array[l] === 1) {
      const animation = [squares[r].changeColorTo(CSanim.GREEN)];
      if (l < r - 1) animation.push(squares[r - 1].changeColorTo(CSanim.RED));
      csa.play(animation, .5);
      r--;
    }
    else {
      const animation = [squares[l].changeColorTo(CSanim.GREEN)];
      if (l + 1 < r) animation.push(squares[l + 1].changeColorTo(CSanim.RED));
      csa.play(animation, .5);
      l++;
    }
  }
  if (l === r) {
    csa.wait(1.5);
    csa.play(squares[l].changeColorTo(CSanim.GREEN), .5);
  }
  csa.wait();

  squares.sort((a, b) => a.position[0] - b.position[0]);
  const finishAnimation = [];
  squares.forEach((square, index) => {
    finishAnimation.push(square.rotate().delay(index * .05));
  });
  csa.play(finishAnimation, .5);
  csa.wait(3);
  csa.run(p5);
};
