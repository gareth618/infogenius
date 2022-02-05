import CSanim from '@components/explicit/Sketch/csanim';

export default function Lee(p5) {
  const csa = new CSanim(400, 400);
  const begPos = [3, 0];
  const endPos = [5, 6];
  const matrix = [
    [ 0,  0,  0,  0,  0, -1,  0, -1,  0,  0],
    [ 0,  0,  0, -1,  0, -1,  0, -1, -1, -1],
    [-1, -1, -1, -1,  0, -1,  0,  0,  0,  0],
    [ 0,  0, -1,  0,  0,  0,  0, -1, -1, -1],
    [ 0,  0, -1,  0, -1,  0,  0,  0,  0,  0],
    [ 0,  0, -1,  0, -1,  0,  0, -1, -1, -1],
    [ 0,  0,  0,  0, -1,  0,  0,  0,  0,  0],
    [ 0,  0,  0,  0, -1,  0,  0, -1, -1, -1],
    [ 0,  0, -1,  0, -1, -1,  0,  0,  0,  0],
    [ 0,  0, -1,  0,  0, -1,  0,  0,  0,  0]
  ];
  const n = matrix.length;

  const width = CSanim.getMaximumSize(n, csa.w - 50);
  const coords = CSanim.getEquidistantPoints(n, width, csa.w / 2);
  const squares = [];
  for (let i = 0; i < n; i++) {
    const row = [];
    squares.push(row);
    for (let j = 0; j < n; j++) {
      const square = new CSanim.Node(csa, [coords[j], coords[i]], width);
      row.push(square);
      square.text = matrix[i][j];
      square.textSize = width / 2;
      if (matrix[i][j] === -1) {
        square.color = CSanim.PURPLE;
        square.textColor = CSanim.WHITE;
      }
    }
  }

  const showAnimation = [];
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      showAnimation.push(squares[i][j].fadeIn());
      showAnimation.push(squares[i][j].zoomIn());
      showAnimation.push(squares[i][j].rotate());
    }
  }
  csa.play(showAnimation, 1);
  csa.wait();

  squares[begPos[0]][begPos[1]].zIndex = 1;
  csa.play([
    squares[begPos[0]][begPos[1]].changeColorTo(CSanim.RED).duration(1),
    squares[begPos[0]][begPos[1]].animate('size', 2 * width).duration(.5),
    squares[begPos[0]][begPos[1]].animate('textSize', width).duration(.5),
    squares[begPos[0]][begPos[1]].animate('size', width).delay(.5).duration(.5),
    squares[begPos[0]][begPos[1]].animate('textSize', width / 2).delay(.5).duration(.5)
  ]);
  squares[endPos[0]][endPos[1]].zIndex = 1;
  csa.play([
    squares[endPos[0]][endPos[1]].changeColorTo(CSanim.GREEN).duration(1),
    squares[endPos[0]][endPos[1]].animate('size', 2 * width).duration(.5),
    squares[endPos[0]][endPos[1]].animate('textSize', width).duration(.5),
    squares[endPos[0]][endPos[1]].animate('size', width).delay(.5).duration(.5),
    squares[endPos[0]][endPos[1]].animate('textSize', width / 2).delay(.5).duration(.5)
  ]);
  matrix[begPos[0]][begPos[1]] = 1;
  csa.play(squares[begPos[0]][begPos[1]].changeTextTo(1), .5);

  const queue = [begPos];
  while (queue.length > 0) {
    const crtRow = queue[0][0];
    const crtCol = queue[0][1];
    const initColor = squares[crtRow][crtCol].color;
    csa.play(squares[crtRow][crtCol].changeColorTo(CSanim.ORANGE), .5);

    const addRow = [-1, 0, 1, 0];
    const addCol = [0, 1, 0, -1];
    for (let i = 0; i < 4; i++) {
      const nghRow = crtRow + addRow[i];
      const nghCol = crtCol + addCol[i];
      if (nghRow === -1) continue; if (nghRow === n) continue;
      if (nghCol === -1) continue; if (nghCol === n) continue;
      if (matrix[nghRow][nghCol] !== 0) continue;

      const square = new CSanim.Node(csa, squares[crtRow][crtCol].position, width);
      square.zIndex = 2;
      square.textSize = width / 2;
      square.color = CSanim.ORANGE;
      square.text = matrix[crtRow][crtCol].toString();
      square.show();
      csa.play([
        square.changeTextTo(matrix[crtRow][crtCol] + 1),
        square.moveTo(squares[nghRow][nghCol].position),
        square.changeColorTo(nghRow === endPos[0] && nghCol === endPos[1] ? CSanim.GREEN : CSanim.YELLOW)
      ], .5);
      squares[nghRow][nghCol].text = matrix[crtRow][crtCol] + 1;
      squares[nghRow][nghCol].color = nghRow === endPos[0] && nghCol === endPos[1] ? CSanim.GREEN : CSanim.YELLOW;
      square.hide();
      matrix[nghRow][nghCol] = matrix[crtRow][crtCol] + 1;
      queue.push([nghRow, nghCol]);
    }
    csa.play(squares[crtRow][crtCol].changeColorTo(initColor), .5);
    queue.shift();
  }

  csa.play([
    squares[endPos[0]][endPos[1]].animate('size', 2 * width).duration(.5),
    squares[endPos[0]][endPos[1]].animate('textSize', width).duration(.5),
    squares[endPos[0]][endPos[1]].animate('size', width).delay(.5).duration(.5),
    squares[endPos[0]][endPos[1]].animate('textSize', width / 2).delay(.5).duration(.5)
  ]);

  const path = [];
  const getPath = (crtRow, crtCol) => {
    path.push([crtRow, crtCol]);
    if (crtRow === begPos[0] && crtCol === begPos[1]) return;
    const addRow = [-1, 0, 1, 0];
    const addCol = [0, 1, 0, -1];
    for (let i = 0; i < 4; i++) {
      const nghRow = crtRow + addRow[i];
      const nghCol = crtCol + addCol[i];
      if (nghRow === -1) continue; if (nghRow === n) continue;
      if (nghCol === -1) continue; if (nghCol === n) continue;
      const initColor = squares[nghRow][nghCol].color;
      csa.play(squares[nghRow][nghCol].changeColorTo(CSanim.ORANGE), .5);
      if (matrix[nghRow][nghCol] === matrix[crtRow][crtCol] - 1) {
        csa.play([
          squares[nghRow][nghCol].zoomColorTo(CSanim.BLUE),
          squares[nghRow][nghCol].changeTextColorTo(CSanim.WHITE)
        ], .5);
        return getPath(nghRow, nghCol);
      }
      csa.play(squares[nghRow][nghCol].changeColorTo(initColor), .5);
    }
  };

  csa.play([
    squares[endPos[0]][endPos[1]].zoomColorTo(CSanim.BLUE),
    squares[endPos[0]][endPos[1]].changeTextColorTo(CSanim.WHITE)
  ], .5);
  getPath(endPos[0], endPos[1]);
  path.reverse();

  const pathAnimation = [];
  path.forEach(([row, col], index) => {
    pathAnimation.push(squares[row][col].rotate().delay(.1 * index));
  });
  csa.play(pathAnimation);

  csa.wait(5);
  const hideAnimation = [];
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      hideAnimation.push(squares[i][j].rotate());
      hideAnimation.push(squares[i][j].zoomOut());
    }
  }
  csa.play(hideAnimation, 1);
  csa.run(p5);
};
