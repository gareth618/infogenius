const paddingH = 20;
const paddingV = 40;
const nodeWidth = 30;

function copy2D(arr) {
  let ret = [];
  for (let i = 0; i < arr.length; i++) {
    ret.push([]);
    for (let j = 0; j < arr[i].length; j++)
      ret[i].push(arr[i][j]);
  }
  return ret;
}

function getCoords(n, ad, x, y) {
  let wid = new Array(n);
  const getWidth = function(node) {
    let sum = -paddingH;
    for (const son of ad[node])
      sum += getWidth(son) + paddingH;
    wid[node] = Math.max(sum, nodeWidth);
    return wid[node];
  };
  getWidth(0);

  let treeX = new Array(n);
  let treeY = new Array(n);
  const draw = function(node, x, y) {
    treeX[node] = x;
    treeY[node] = y;
    let sum = x - wid[node] / 2;
    for (const son of ad[node]) {
      draw(son, sum + wid[son] / 2, y + paddingV + nodeWidth);
      sum += wid[son] + paddingH;
    }
    if (ad[node].length > 0) {
      if (ad[node].length % 2 === 1)
        treeX[node] = treeX[ad[node][Math.floor(ad[node].length / 2)]];
      else
        treeX[node] = (treeX[ad[node][ad[node].length / 2]] + treeX[ad[node][ad[node].length / 2 - 1]]) / 2;
    }
  };
  draw(0, 0, y);

  for (let i = 1; i < n; i++)
    treeX[i] += x - treeX[0];
  treeX[0] = x;
  return [treeX, treeY];
}

function getPrevCoords(n, ad, x, y) {
  let now = copy2D(ad);
  for (let i = 0; i < n; i++)
    for (let j = 0; j < now[i].length; j++)
      if (now[i][j] === n - 1)
        now[i].splice(j, 1);
  n--;
  return getCoords(n, now, x, y);
}

class State {
  constructor(n, ad, letter, colors, crtNode, percent, newNode, leaves, start, fps) {
    this.n = n;
    this.ad = copy2D(ad);
    this.letter = [...letter];
    this.colors = [...colors];
    this.crtNode = crtNode;
    this.percent = percent;
    this.newNode = newNode;
    this.leaves = [...leaves];
    this.start = start;
    this.fps = fps;
  }

  draw() {
    const coords = getCoords(this.n, this.ad, 260, 40);
    if (this.newNode !== -1) {
      const prevCoords = getPrevCoords(this.n, this.ad, 260, 40);
      for (let i = 0; i < this.n - 1; i++) {
        coords[0][i] = prevCoords[0][i] + (coords[0][i] - prevCoords[0][i]) * this.percent / 100;
        coords[1][i] = prevCoords[1][i] + (coords[1][i] - prevCoords[1][i]) * this.percent / 100;
      }
    }
    strokeWeight(3);
    for (let i = 0; i < this.n; i++)
      for (const j of this.ad[i]) {
        if (this.colors[j] === 0)
          stroke(250);
        else
          stroke(30, 144, 255);
        if (j === this.newNode)
          line(
            coords[0][i], coords[1][i],
            coords[0][i] + (coords[0][j] - coords[0][i]) / 100 * this.percent,
            coords[1][i] + (coords[1][j] - coords[1][i]) / 100 * this.percent
          );
        else
          line(coords[0][i], coords[1][i], coords[0][j], coords[1][j]);
        if (this.crtNode === 0 && this.newNode === -1 && this.percent !== 0 && !this.start) {
          if (this.colors[j] === 0)
            stroke(250);
          else
            stroke(
              30 + (250 - 30) * this.percent / 100,
              144 + (250 - 144) * this.percent / 100,
              255 + (250 - 255) * this.percent / 100
            );
          line(coords[0][i], coords[1][i], coords[0][j], coords[1][j]);
        }
        stroke(30, 144, 255);
        if (j === this.crtNode) {
          line(
            coords[0][i], coords[1][i],
            coords[0][i] + (coords[0][j] - coords[0][i]) / 100 * this.percent,
            coords[1][i] + (coords[1][j] - coords[1][i]) / 100 * this.percent
          );
        }
      }
    noStroke();
    for (let i = 0; i < this.n; i++) {
      if (this.colors[i] === 0) {
        if (this.leaves[i] === 0)
          fill(250);
        else
          fill(124, 252, 0);
      }
      else
        fill(30, 144, 255);
      if (i === this.newNode)
        circle(coords[0][i], coords[1][i], nodeWidth * this.percent / 100);
      else
        circle(coords[0][i], coords[1][i], nodeWidth);
      if (i === this.crtNode) {
        fill(30, 144, 255);
        circle(coords[0][i], coords[1][i], nodeWidth * this.percent / 100);
      }
      if (this.crtNode === 0 && this.newNode === -1 && this.percent !== 0 && !this.start) {
        if (this.leaves[i] === 0) {
          if (this.colors[i] === 0)
            fill(250);
          else
            fill(
              30 + (250 - 30) * this.percent / 100,
              144 + (250 - 144) * this.percent / 100,
              255 + (250 - 255) * this.percent / 100
            );
        }
        else {
          if (this.colors[i] === 0)
            fill(124, 252, 0);
          else
            fill(
              30 + (124 - 30) * this.percent / 100,
              144 + (252 - 144) * this.percent / 100,
              255 + (0 - 255) * this.percent / 100
            );
        }
        circle(coords[0][i], coords[1][i], nodeWidth);
      }
      fill(0);
      textSize(i === this.newNode ? 20 * this.percent / 100 : 20);
      text(this.letter[i], coords[0][i], coords[1][i]);
    }
  }
}

let frame = 0;
let state = 0;
let queue = [];

class Trie {
  enqueue(fps = 50) {
    queue.push(new State(this.n, this.ad, this.letter, this.colors, this.crtNode, this.percent, this.newNode, this.leaves, this.start, fps));
  }

  constructor() {
    this.n = 1;
    this.ad = [[]];
    this.letter = [''];
    this.colors = [0];
    this.crtNode = 0;
    this.percent = 0;
    this.newNode = -1;
    this.leaves = [0];
    this.start = false;
    this.enqueue();
  }

  insert(str) {
    let node = 0;
    this.enqueue();
    this.start = true;
    for (let i = 0; i < 50; i++) {
      this.percent += 2;
      this.enqueue(1);
    }
    this.start = false;
    this.percent = 0;
    this.colors[node] = 1;
    for (const chr of str) {
      let next = 0;
      for (const son of this.ad[node])
        if (this.letter[son] === chr) {
          next = son;
          break;
        }
      if (next === 0) {
        next = this.n++;
        this.ad.push([]);
        this.ad[node].push(next);
        this.letter.push(chr);
        this.colors.push(0);
        this.leaves.push(0);
        for (let i = 0; i < this.n; i++)
          this.ad[i].sort((x, y) => {
            const a = this.letter[x];
            const b = this.letter[y];
            return (a < b ? -1 : (a > b ? +1 : 0));
          });
        this.newNode = next;
        for (let i = 0; i < 50; i++) {
          this.percent += 2;
          this.enqueue(1);
        }
        this.newNode = -1;
        this.percent = 0;
      }
      this.crtNode = next;
      for (let i = 0; i < 50; i++) {
        this.percent += 2;
        this.enqueue(1);
      }
      this.crtNode = 0;
      this.percent = 0;
      this.colors[next] = 1;
      node = next;
    }
    this.leaves[node] = 1;
    for (let i = 0; i < 50; i++) {
      this.percent += 2;
      this.enqueue(1);
    }
    this.percent = 0;
    for (let i = 0; i < this.n; i++)
      this.colors[i] = 0;
    this.enqueue();
  }
}

let trie;

function setup() {
  createCanvas(500, 500);
  textSize(20);
  textFont('Consolas, Monaco, monospace');
  textAlign(CENTER, CENTER);
  noStroke();

  trie = new Trie();
  trie.insert('mare');
  trie.insert('paste');
  trie.insert('lat');
  trie.insert('lac');
  trie.insert('patine');
  trie.insert('marte');
  trie.insert('lung');
  trie.insert('pat');
  trie.insert('mic');
  trie.insert('pas');
  trie.insert('prim');
  trie.insert('latin');
  trie.enqueue(500);
  trie.enqueue(1);
}

let paused = false;
let active = false;

function draw() {
  if (paused)
    background(75);
  else
    background(30);

  fill(50);
  textSize(10);
  text('InfoGenius.ro', 37, height - 5);
  textSize(20);

  if (!active) {
    fill(250);
    textSize(25);
    text('Click pentru a începe!', width / 2, height / 2);
    cursor(HAND);
    return;
  }

  if (++frame === queue[state].fps) {
    state++;
    frame = 0;
  }

  if (state === queue.length - 1)
    active = false;  
  queue[state].draw();
}

function mousePressed() {
  if (!active) {
    state = 0;
    active = true;
    cursor(ARROW);
  }
  else if (paused) {
    loop();
    paused = false;
  }
  else {
    noLoop();
    paused = true;
  }
}
