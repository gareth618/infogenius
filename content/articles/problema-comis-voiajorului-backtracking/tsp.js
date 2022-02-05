import CSanim from '@components/explicit/Sketch/csanim';

export default function Tsp(p5) {
  const csa = new CSanim(450, 300);
  const nodes = [
    [250, 50],
    [50, 50],
    [50, 250],
    [150, 150],
    [250, 250]
  ];
  const n = nodes.length;

  const edges = [
    [0, 1, 20],
    [0, 4, 60],
    [0, 3, 30],
    [1, 3, 30],
    [3, 2, 70],
    [1, 2, 40],
    [3, 4, 30],
    [4, 2, 30]
  ];
  const adj = [];
  for (let i = 0; i < n; i++) {
    adj.push([]);
    for (let j = 0; j < n; j++) {
      adj[i].push({ });
    }
  }

  const circles = [];
  nodes.forEach((point, index) => {
    circles.push(new CSanim.Circle(csa, point, 40));
    circles[index].text = (index + 1).toString();
    circles[index].color = CSanim.ORANGE;
    circles[index].zIndex = 1;
  });

  for (const [x, y, z] of edges) {
    adj[x][y] = adj[y][x] = {
      cost: z,
      line: nodes[x][0] < nodes[y][0]
        ? new CSanim.Line(csa, nodes[x], nodes[y])
        : new CSanim.Line(csa, nodes[y], nodes[x])
    };
    adj[x][y].line.text = z.toString();
    adj[x][y].line.weight = 4;
  }

  let crtCost = 0;
  const crtCostText = new CSanim.Text(csa, [360, csa.h / 2 - 15]);
  crtCostText.text = '**cost:** 0';
  let bstCost = 1e9;
  const bstCostText = new CSanim.Text(csa, [360, csa.h / 2 + 15]);
  bstCostText.text = '**best:** INF';

  const showAnimation = [
    crtCostText.fadeIn(),
    bstCostText.fadeIn()
  ];
  for (let i = 0; i < n; i++) {
    showAnimation.push(circles[i].zoomIn());
  }
  for (const [x, y] of edges) {
    showAnimation.push(adj[x][y].line.fadeIn());
    showAnimation.push(adj[x][y].line.zoomIn());
  }
  csa.play(showAnimation, 1);
  csa.wait();

  let bstPath = [];
  const path = [0];
  const visited = Array(n).fill(false);
  visited[0] = true;

  const bkt = (pos, totalCost) => {
    if (pos === n + 1) {
      if (crtCost < bstCost) {
        bstPath = [...path];
        bstCost = crtCost;
        bstCostText.text = `**best:** ${bstCost}`;
        csa.play([
          bstCostText.changeTextColorTo(CSanim.RED).duration(.5),
          bstCostText.changeTextColorTo(CSanim.WHITE).delay(.5).duration(.5)
        ], 1);
      }
      return;
    }

    const node = path[pos - 1];
    adj[node].forEach(({ cost, line }, nghb) => {
      if (cost == null) return;
      if (visited[nghb] && !(pos === n && nghb === 0)) return;

      crtCost += cost;
      crtCostText.text = `**cost:** ${crtCost}`;
      const animationBeg = [];
      animationBeg.push((nodes[node].toString() === line.beg.toString() ? line.zoomColorToEnd(CSanim.RED) : line.zoomColorToBeg(CSanim.RED)).duration(1));
      animationBeg.push(line.animate('textSize', 20).duration(.5));
      animationBeg.push(line.animate('textSize', 15).delay(.5).duration(.5));
      if (pos === n) {
        animationBeg.push(crtCostText.changeTextColorTo(CSanim.GREEN).duration(.5));
        animationBeg.push(crtCostText.changeTextColorTo(CSanim.WHITE).delay(.5).duration(.5));
      }
      csa.play(animationBeg);

      if (pos < n) visited[nghb] = true;
      path.push(nghb);
      bkt(pos + 1, totalCost + cost);
      path.pop();
      if (pos < n) visited[nghb] = false;

      crtCost -= cost;
      crtCostText.text = `**cost:** ${crtCost}`;
      const animationEnd = [];
      animationEnd.push((nodes[node].toString() === line.beg.toString() ? line.zoomColorToBeg(CSanim.WHITE) : line.zoomColorToEnd(CSanim.WHITE)).duration(1));
      animationEnd.push(line.animate('textSize', 10).duration(.5));
      animationEnd.push(line.animate('textSize', 15).delay(.5).duration(.5));
      csa.play(animationEnd);
    });
  };
  bkt(1);

  const moveAnimation = [
    crtCostText.fadeOut(),
    bstCostText.fadeOut()
  ];
  for (const circle of circles) {
    moveAnimation.push(circle.moveTo([circle.position[0] + (csa.w - 300) / 2, circle.position[1]]));
  }
  for (const [x, y] of edges) {
    const line = adj[x][y].line;
    moveAnimation.push(line.animate('beg', [line.beg[0] + (csa.w - 300) / 2, line.beg[1]]));
    moveAnimation.push(line.animate('end', [line.end[0] + (csa.w - 300) / 2, line.end[1]]));
  }
  csa.play(moveAnimation, 1);

  const finishAnimation = [];
  for (let i = 1; i <= n; i++) {
    const node = bstPath[i];
    const line = adj[bstPath[i - 1]][node].line;
    const delay = i - 1;
    finishAnimation.push((circles[node].position.toString() === line.beg.toString() ? line.zoomColorToBeg(CSanim.RED) : line.zoomColorToEnd(CSanim.RED)).delay(delay).duration(1));
    finishAnimation.push(line.animate('textSize', 20).delay(delay).duration(.5));
    finishAnimation.push(line.animate('textSize', 15).delay(delay + .5).duration(.5));
  }
  csa.play(finishAnimation);
  csa.wait(3);

  const hideAnimation = [];
  for (const circle of circles) hideAnimation.push(circle.fadeOut());
  for (const [x, y] of edges) hideAnimation.push(adj[x][y].line.fadeOut());
  csa.play(hideAnimation, 1);
  csa.run(p5);
};
