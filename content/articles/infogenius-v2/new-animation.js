import CSanim from '@components/explicit/Sketch/csanim';

export default function NewAnimation(p5) {
  const csa = new CSanim(500, 200);
  for (const { arr, val } of [
    { arr: [2, 7, 7, 7, 7, 23, 31, 50, 89, 122], val: 89 },
    { arr: [2, 7, 7, 7, 7, 23, 31, 50, 89, 122], val: 7 },
    { arr: [2, 7, 7, 7, 7, 23, 31, 50, 89, 122], val: 618 },
    { arr: [2, 7, 7, 7, 7, 23, 31, 50, 89, 122], val: 1 },
    { arr: [2, 7, 7, 7, 7, 23, 31, 50, 89, 122], val: 6 }
  ]) {
    const array = arr;
    array.unshift(-1e9);
    array.push(+1e9);

    const width = CSanim.getMaximumSize(array.length, csa.w - 50);
    const coordsX = CSanim.getEquidistantPoints(array.length, width, csa.w / 2);
    const squares = [];
    for (let i = 0; i < array.length; i++) {
      squares.push(new CSanim.Square(csa, [coordsX[i], 125], width));
      squares[i].text = array[i];
      squares[i].textSize = width / 2;
      if (array[i] === -1e9) { squares[i].text = '-INF'; squares[i].textSize = 10; }
      if (array[i] === +1e9) { squares[i].text = '+INF'; squares[i].textSize = 10; }
    }

    const showAnimation = [];
    squares.forEach((square, index) => {
      showAnimation.push(square.fadeIn().delay(index * .1));
    });
    csa.play(showAnimation, 1);

    const text = new CSanim.Text(csa, [csa.w / 2, 25], `x = ${val}`);
    text.textColor = CSanim.YELLOW;
    csa.play(text.fadeIn(), 1);

    let lo = 0, hi = array.length - 1;
    const arrowLo = new CSanim.Line(csa, [squares[lo].position[0], 50], [squares[lo].position[0], 100]);
    const arrowHi = new CSanim.Line(csa, [squares[hi].position[0], 50], [squares[hi].position[0], 100]);
    arrowLo.arrow = true; arrowLo.color = CSanim.RED;
    arrowHi.arrow = true; arrowHi.color = CSanim.RED;
    csa.play([
      squares[lo].changeColorTo(CSanim.RED),
      squares[hi].changeColorTo(CSanim.RED),
      arrowLo.fadeIn(), arrowLo.zoomIn(),
      arrowHi.fadeIn(), arrowHi.zoomIn()
    ], 1);

    while (hi - lo > 1) {
      csa.wait();
      const md = Math.floor((lo + hi) / 2);
      const arrowMd = new CSanim.Line(csa, [squares[md].position[0], 50], [squares[md].position[0], 100]);
      arrowMd.arrow = true;
      arrowMd.color = CSanim.ORANGE;
      csa.play([
        squares[md].changeColorTo(CSanim.ORANGE),
        arrowMd.fadeIn(),
        arrowMd.zoomIn()
      ], 1);

      const text = new CSanim.Text(csa, [csa.w / 2, 175], `${val} ${val < array[md] ? '<' : '≥'} ${array[md]}`);
      csa.play(text.fadeIn());
      csa.wait(1.5);
      csa.play(text.fadeOut());
      if (val < array[md]) {
        csa.play([
          arrowHi.animate('beg', [squares[md].position[0], 50]),
          arrowHi.animate('end', [squares[md].position[0], 100]),
          squares[hi].changeColorTo(CSanim.WHITE),
          squares[md].changeColorTo(CSanim.RED),
          arrowMd.fadeOut(),
          arrowMd.zoomOut()
        ], 1);
        hi = md;
      }
      else {
        csa.play([
          arrowLo.animate('beg', [squares[md].position[0], 50]),
          arrowLo.animate('end', [squares[md].position[0], 100]),
          squares[lo].changeColorTo(CSanim.WHITE),
          squares[md].changeColorTo(CSanim.RED),
          arrowMd.fadeOut(),
          arrowMd.zoomOut()
        ], 1);
        lo = md;
      }
    }

    csa.play([
      arrowLo.fadeOut(), arrowLo.zoomOut(),
      arrowHi.fadeOut(), arrowHi.zoomOut(),
      squares[hi].changeColorTo(CSanim.WHITE),
      squares[lo].changeColorTo(array[lo] === val ? CSanim.GREEN : CSanim.PURPLE)
    ], 1);
    const message = new CSanim.Text(csa, [csa.w / 2, 175], array[lo] === val ? 'SUCCES! :)' : 'EȘEC! :(');
    message.textColor = CSanim.RED;
    csa.play(message.fadeIn());
    if (array[lo] === val) csa.play(squares[lo].rotate(), 1);
    csa.wait(3);
    csa.play(message.fadeOut());

    const hideAnimation = [text.fadeOut()];
    squares.forEach((square, index) => {
      hideAnimation.push(square.fadeOut().delay(index * .1));
    });
    csa.play(hideAnimation, 1);
    csa.wait();
  }
  csa.run(p5);
};
