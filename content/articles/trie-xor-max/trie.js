import CSanim from '@components/explicit/Sketch/csanim';

export default function Trie(p5) {
  const csa = new CSanim(400, 400);
  const size = 24;
  const rootX = csa.w / 2 + 8;
  const rootY = 32;
  const paddingH = 16;
  const paddingV = 32;

  const trie = {
    circle: (() => {
      const circle = new CSanim.Circle(csa, [rootX, rootY], size);
      circle.zIndex = 1;
      return circle;
    })(),
    line: null,
    sons: new Map()
  };
  csa.play(trie.circle.zoomIn(), .5);

  const updateCoords = newNodeCircleRef => {
    const edges = [];
    const dfsLabel = node => {
      const nodePos = edges.length;
      edges.push([]);
      const sons = [];
      for (const [key, val] of node.sons.entries()) {
        sons.push([key, val]);
      }
      sons.sort(([key1], [key2]) => key1 < key2 ? -1 : +1);
      for (const [, val] of sons) {
        edges[nodePos].push(edges.length);
        dfsLabel(val);
      }
    };
    dfsLabel(trie);

    let [, , coordsX, coordsY] = CSanim.getTreeCoords(edges.length, edges, size, paddingH, paddingV);
    coordsX = coordsX.map(x => rootX + x);
    coordsY = coordsY.map(y => rootY + y);

    const animation = [];
    let nodeCnt = 0;
    const dfsCoords = (node, fathId) => {
      const nodeId = nodeCnt++;
      if (node.circle === newNodeCircleRef) {
        node.circle.position = [coordsX[nodeId], coordsY[nodeId]];
        animation.push(node.circle.zoomIn());
      }
      else {
        animation.push(node.circle.moveTo([coordsX[nodeId], coordsY[nodeId]]));
      }

      if (fathId !== -1) {
        animation.push(node.line.animate('beg', [coordsX[fathId], coordsY[fathId]]));
        if (node.circle === newNodeCircleRef) {
          node.line.end = [coordsX[nodeId], coordsY[nodeId]];
          animation.push(node.line.zoomIn());
        }
        else {
          animation.push(node.line.animate('end', [coordsX[nodeId], coordsY[nodeId]]));
        }
      }

      const sons = [];
      for (const [key, val] of node.sons.entries()) {
        sons.push([key, val]);
      }
      sons.sort(([key1], [key2]) => key1 < key2 ? -1 : +1);
      for (const [, val] of sons) {
        dfsCoords(val, nodeId);
      }
    };
    dfsCoords(trie, -1);
    return animation;
  };

  for (const word of [
    'mare',
    'paste',
    'lat',
    'lac',
    'patine',
    'marte',
    'lung',
    'pat',
    'mic',
    'pas',
    'prim',
    'latin'
  ]) {
    let node = trie;
    csa.play(node.circle.zoomColorTo(CSanim.BLUE), .5);
    const finishAnimation = [node.circle.changeColorTo(CSanim.WHITE)];

    for (const chr of word) {
      let newNodeCircleRef = null;
      if (node.sons.get(chr) == null) {
        const circle = new CSanim.Circle(csa, [0, 0], size);
        circle.zIndex = 1;
        circle.text = chr;
        newNodeCircleRef = circle;

        const line = new CSanim.Line(csa, node.circle.position, [0, 0]);
        line.color = CSanim.OLDLACE;
        node.sons.set(chr, {
          circle,
          line,
          sons: new Map()
        });
        csa.play(updateCoords(newNodeCircleRef), .5);
      }

      node = node.sons.get(chr);
      const initColor = node.circle.color;
      finishAnimation.push(node.circle.changeTextColorTo(CSanim.BLACK));
      finishAnimation.push(node.line.changeColorTo(CSanim.OLDLACE));
      finishAnimation.push(node.circle.changeColorTo(initColor));

      const animation = [
        node.circle.zoomColorTo(CSanim.BLUE),
        node.circle.changeTextColorTo(CSanim.WHITE),
        node.line.zoomColorToEnd(CSanim.BLUE)
      ];
      csa.play(animation, .5);
    }

    finishAnimation.pop();
    finishAnimation.push(node.circle.changeColorTo(CSanim.GREEN));
    csa.play(finishAnimation, 1);
  }

  const finishAnimation = [];
  const dfs = node => {
    finishAnimation.push(node.circle.fadeOut());
    if (node.line != null) finishAnimation.push(node.line.fadeOut());
    for (const [, val] of node.sons.entries()) dfs(val);
  };
  dfs(trie);
  csa.wait(5);
  csa.play(finishAnimation, 1);
  csa.run(p5);
};
