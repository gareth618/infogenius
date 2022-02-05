import CSanim from '@components/explicit/Sketch/csanim';

export default function EuclideanAlgorithm(p5) {
  const csa = new CSanim(600, 150);
  const pair1 = [5, 18];
  const pair2 = [20, 24];
  const pair3 = [60, 35];

  for (const pair of [pair1, pair2, pair3]) {
    const initA = pair[0];
    const initB = pair[1];

    const getCoords = () => {
      const maxLen = p5.max(pair[0], pair[1]);
      const width = p5.min(
        CSanim.getMaximumSize(maxLen, csa.w - 100),
        CSanim.getMaximumSize(2, csa.h - 50, 1)
      );
      const coordsX = CSanim.getEquidistantPoints(maxLen, width, 50 + (width * maxLen + width / 5 * (maxLen - 1)) / 2);
      const coordsY = CSanim.getEquidistantPoints(2, width, csa.h / 2, 1);
      return [coordsX, coordsY, width];
    };

    const getShowAnimation = (squaresA, squaresB, textA, textB) => {
      const animation = [];
      squaresA.forEach(square => animation.push(square.fadeIn()));
      squaresB.forEach(square => animation.push(square.fadeIn()));
      animation.push(textA.fadeIn());
      animation.push(textB.fadeIn());
      return animation;
    };

    const getHideAnimation = (squaresA, squaresB, textA, textB) => {
      const animation = [];
      squaresA.forEach(square => animation.push(square.fadeOut()));
      squaresB.forEach(square => animation.push(square.fadeOut()));
      animation.push(textA.fadeOut());
      animation.push(textB.fadeOut());
      return animation;
    };

    const [coordsX, coordsY, width] = getCoords();
    const squaresA = []; for (let i = 0; i < pair[0]; i++) squaresA.push(new CSanim.Node(csa, [coordsX[i], coordsY[0]], width));
    const squaresB = []; for (let i = 0; i < pair[1]; i++) squaresB.push(new CSanim.Node(csa, [coordsX[i], coordsY[1]], width));
    const textA = new CSanim.Text(csa, [25, coordsY[0]], pair[0].toString()); textA.textSize = p5.max(width * 2 / 3, 10); textA.textColor = CSanim.BLUE;
    const textB = new CSanim.Text(csa, [25, coordsY[1]], pair[1].toString()); textB.textSize = p5.max(width * 2 / 3, 10); textB.textColor = CSanim.BLUE;

    csa.play(getShowAnimation(squaresA, squaresB, textA, textB), 1);
    csa.wait();
    while (pair[0] > 0 && pair[1] > 0) {
      const array = pair[0] > pair[1] ? squaresA : squaresB;
      const min = p5.min(pair[0], pair[1]);
      const zoomOutAnimation = [];
      for (let i = 0; i < min; i++) {
        zoomOutAnimation.push(array[i].zoomOut());
      }
      csa.play(zoomOutAnimation, .5);

      const moveLeftAnimation = [];
      for (let i = min; i < array.length; i++) {
        moveLeftAnimation.push(array[i].moveLeft(min));
        array[i - min] = array[i];
      }
      for (let i = 0; i < min; i++) {
        array.pop();
      }
      if (pair[0] > pair[1]) pair[0] -= min;
      else pair[1] -= min;
      moveLeftAnimation.push(textA.changeTextTo(pair[0].toString()));
      moveLeftAnimation.push(textB.changeTextTo(pair[1].toString()));
      csa.play(moveLeftAnimation, .5);

      const resizeAnimation = [];
      const [coordsX, coordsY, width] = getCoords();
      for (let i = 0; i < pair[0]; i++) resizeAnimation.push(squaresA[i].moveTo([coordsX[i], coordsY[0]]));
      for (let i = 0; i < pair[1]; i++) resizeAnimation.push(squaresB[i].moveTo([coordsX[i], coordsY[1]]));
      for (let i = 0; i < pair[0]; i++) resizeAnimation.push(squaresA[i].animate('size', width));
      for (let i = 0; i < pair[1]; i++) resizeAnimation.push(squaresB[i].animate('size', width));
      resizeAnimation.push(textA.animate('position', [25, coordsY[0]]));
      resizeAnimation.push(textB.animate('position', [25, coordsY[1]]));
      resizeAnimation.push(textA.animate('textSize', p5.max(width * 2 / 3, 10)));
      resizeAnimation.push(textB.animate('textSize', p5.max(width * 2 / 3, 10)));
      csa.play(resizeAnimation, .5);
    }
    const gcd = pair[0] + pair[1];
    csa.wait();

    csa.play(getHideAnimation(squaresA, squaresB, textA, textB), 1);
    const finalSquaresA = []; for (let i = 0; i < initA; i++) finalSquaresA.push(new CSanim.Node(csa, [coordsX[i], coordsY[0]], width));
    const finalSquaresB = []; for (let i = 0; i < initB; i++) finalSquaresB.push(new CSanim.Node(csa, [coordsX[i], coordsY[1]], width));
    const finalTextA = new CSanim.Text(csa, [25, coordsY[0]], initA.toString()); finalTextA.textSize = p5.max(width * 2 / 3, 10);
    const finalTextB = new CSanim.Text(csa, [25, coordsY[1]], initB.toString()); finalTextB.textSize = p5.max(width * 2 / 3, 10);
    for (const squares of [finalSquaresA, finalSquaresB]) {
      for (let i = 0; i < squares.length; i += gcd) {
        for (let j = 0; j < gcd; j++) {
          squares[i + j].color = (i / gcd % 2 === 0 ? CSanim.YELLOW : CSanim.ORANGE);
        }
      }
    }
    csa.play(getShowAnimation(finalSquaresA, finalSquaresB, finalTextA, finalTextB), 1);
    csa.wait(3);
    csa.play(getHideAnimation(finalSquaresA, finalSquaresB, finalTextA, finalTextB), 1);
    csa.wait();
  }
  csa.run(p5);
};
