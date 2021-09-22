import CSanim from '@components/explicit/Sketch/csanim';

export default function EratosthenesSieve(p5) {
  const csa = new CSanim(400, 400);
  const n = 15;

  const width = CSanim.getMaximumSize(n, csa.w - 20);
  const coords = CSanim.getEquidistantPoints(n, width, csa.w / 2);
  const squares = [];
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i > 0 || j > 0) {
        squares.push(new CSanim.Node(csa, [coords[j], coords[i]], width));
        squares[squares.length - 1].text = i * n + j + 1;
        squares[squares.length - 1].textSize = width / 2;
      }
    }
  }

  const showAnimation = [];
  for (const square of squares) {
    showAnimation.push(square.fadeIn());
    showAnimation.push(square.zoomIn());
    showAnimation.push(square.rotate());
  }
  csa.play(showAnimation, 1);
  csa.wait();

  for (let i = 2; i <= n * n; i++) {
    if (squares[i - 2].color.toString() === CSanim.WHITE.toString()) {
      csa.play([
        squares[i - 2].rotate(),
        squares[i - 2].changeColorTo(CSanim.GREEN)
      ]);

      const animation = [];
      for (let j = 2 * i, it = 0; j <= n * n; j += i, it++) {
        animation.push(squares[j - 2].changeColorTo(CSanim.RED).duration(.25).delay(.1 * it));
        animation.push(squares[j - 2].animate('size', 1.2 * width).duration(.125).delay(.1 * it));
        animation.push(squares[j - 2].animate('size', width).duration(.125).delay(.1 * it + .125));
        animation.push(squares[j - 2].changeColorTo(CSanim.ORANGE).duration(.25).delay(.1 * it + .25));
      }
      csa.play(animation);

      csa.play([
        squares[i - 2].rotate(),
        squares[i - 2].changeColorTo(CSanim.BLUE),
        squares[i - 2].changeTextColorTo(CSanim.WHITE)
      ]);
    }
  }
  csa.wait(3);

  const hideAnimation = [];
  for (const square of squares) {
    hideAnimation.push(square.zoomOut());
    hideAnimation.push(square.rotate());
  }
  csa.play(hideAnimation, 1);
  csa.wait();
  csa.run(p5);
};
