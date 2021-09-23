export default class CSanim {
  static get WHITE() { return [250, 250, 250]; }
  static get BLACK() { return [30, 30, 30]; }
  static get RED() { return [255, 69, 0]; }
  static get BLUE() { return [30, 144, 255]; }
  static get GREEN() { return [124, 252, 0]; }
  static get YELLOW() { return [255, 215, 0]; }
  static get ORANGE() { return [255, 140, 0]; }
  static get OLDLACE() { return [253, 245, 230]; }
  static get PURPLE() { return [102, 51, 153]; }

  static linearMap(value, beg1, end1, beg2, end2) {
    return (value - beg1) / (end1 - beg1) * (end2 - beg2) + beg2;
  }

  static easingMap(value, beg1, end1, beg2, end2) {
    const x = CSanim.linearMap(value, beg1, end1, 0, 1);
    const f = x * x / (x * x + (1 - x) * (1 - x));
    return CSanim.linearMap(f, 0, 1, beg2, end2);
  }

  static getMaximumSize(length, totalSize, ratio = 5) {
    return ratio * totalSize / (ratio * length + length - 1);
  }

  static getEquidistantPoints(length, size, center, ratio = 5) {
    const space = size / ratio;
    const totalSize = length * size + (length - 1) * space;
    const points = [];
    for (let i = 0; i < length; i++) {
      points.push(center - totalSize / 2 + i * (size + space) + size / 2);
    }
    return points;
  }

  static getTreeCoords(nodes, edges, nodeSize, paddingH = nodeSize * 1.5, paddingV = nodeSize * 1.75) {
    const width = new Array(nodes);
    const getNodeWidth = node => {
      let sum = -paddingH;
      for (const son of edges[node]) {
        getNodeWidth(son);
        sum += width[son] + paddingH;
      }
      width[node] = Math.max(sum, nodeSize);
    };
    getNodeWidth(0);

    const treeX = new Array(nodes);
    const treeY = new Array(nodes);
    const getSubtreeCoords = (node, x, y) => {
      treeX[node] = x;
      treeY[node] = y;
      let sum = x - width[node] / 2;
      for (const son of edges[node]) {
        getSubtreeCoords(son, sum + width[son] / 2, y + paddingV + nodeSize);
        sum += width[son] + paddingH;
      }
      if (edges[node].length > 0) {
        treeX[node] = edges[node].length % 2 === 1
          ? treeX[edges[node][Math.floor(edges[node].length / 2)]]
          : (
            treeX[edges[node][edges[node].length / 2]] +
            treeX[edges[node][edges[node].length / 2 - 1]]
          ) / 2;
      }
    };
    getSubtreeCoords(0, 0, 0);
    for (let i = 1; i < nodes; i++) {
      treeX[i] -= treeX[0];
    }
    treeX[0] = 0;

    const getSubtreeHeight = node => {
      let max = 0;
      for (const son of edges[node]) {
        max = Math.max(max, getSubtreeHeight(son) + 1);
      }
      return max;
    };
    const height = getSubtreeHeight(0);
    return [width[0], height * paddingV + (height + 1) * nodeSize, treeX, treeY];
  }

  constructor(w, h) {
    this.w = w;
    this.h = h;
    this.shapes = [];
    this.frames = [];
  }

  static #Shape = class {
    constructor(csa) {
      this.id = csa.shapes.length;
      csa.shapes.push(this);
      this.zIndex = 0;
      this.visible = false;
      this.color = CSanim.WHITE;
      this.text = '';
      this.textSize = 10;
      this.textColor = CSanim.BLACK;
    }

    animate(prop, value, begFun = () => { }, endFun = () => { }) {
      const animation = {
        shape: this,
        prop,
        value: typeof value === 'object' ? [...value] : value,
        begFun,
        endFun
      };
      animation.delay = val => { animation.delay = val; return animation; }
      animation.duration = val => { animation.duration = val; return animation; }
      return animation;
    }

    show() { this.visible = true; }
    hide() { this.visible = false; }

    changeColorTo(color) { return this.animate('color', color); }
    changeTextColorTo(color) { return this.animate('textColor', color); }
    changeTextBoxColorTo(color) { return this.animate('textBoxColor', color); }

    changeTextTo(text) {
      return this.animate('newTextOpacity', 255,
        shape => { shape.newText = text; shape.newTextOpacity = 0; },
        shape => { shape.text = text; shape.newText = undefined; shape.newTextOpacity = undefined; }
      );
    }

    fadeIn() {
      return this.animate('opacity', 255,
        shape => { shape.visible = true; shape.opacity = 0; },
        shape => { shape.opacity = undefined; }
      );
    }

    fadeOut() {
      return this.animate('opacity', 0,
        shape => { shape.opacity = 255; },
        shape => { shape.visible = false; shape.opacity = undefined; }
      );
    }
  }

  static Node = class extends CSanim.#Shape {
    constructor(csa, position, size, getCorner = () => 0) {
      super(csa);
      this.position = [...position];
      this.size = size;
      this.textSize = size * .6;
      this.ratio = 5;
      this.getCorner = getCorner;
    }

    draw(p5) {
      const size = this.zoomedSize == null ? this.size : this.zoomedSize[0];
      const textSize = this.zoomedSize == null ? this.textSize : this.zoomedSize[1];
      p5.translate(+this.position[0], +this.position[1]);
      p5.rotate(this.angle == null ? 0 : +this.angle);
      p5.fill(...this.color, this.opacity == null ? 255 : this.opacity);
      p5.square(0, 0, size, this.getCorner(size));
      if (this.newColor != null) {
        p5.fill(this.newColor[0], this.newColor[1], this.newColor[2]);
        p5.square(0, 0, this.newColor[3], this.getCorner(this.newColor[3]));
      }
      p5.textSize(textSize);
      if (this.newText != null) {
        p5.fill(...this.textColor, 255 - this.newTextOpacity);
        p5.text(this.text, 0, 0);
        p5.fill(...this.textColor, this.newTextOpacity);
        p5.text(this.newText, 0, 0);
      }
      else {
        p5.fill(...this.textColor, this.opacity == null ? 255 : this.opacity);
        p5.text(this.text, 0, 0);
      }
      p5.rotate(this.angle == null ? 0 : -this.angle);
      p5.translate(-this.position[0], -this.position[1]);
    }

    moveTo(position) {
      return this.animate('position', position);
    }

    move(vector) {
      return this.moveTo([
        this.position[0] + vector[0],
        this.position[1] + vector[1]
      ]);
    }

    moveUp   (steps = 1) { return this.move([0, -(this.size + this.size / this.ratio) * steps]); }
    moveDown (steps = 1) { return this.move([0, +(this.size + this.size / this.ratio) * steps]); }
    moveLeft (steps = 1) { return this.move([-(this.size + this.size / this.ratio) * steps, 0]); }
    moveRight(steps = 1) { return this.move([+(this.size + this.size / this.ratio) * steps, 0]); }

    rotate() {
      return this.animate('angle', 360,
        shape => shape.angle = 0,
        shape => shape.angle = undefined
      );
    }

    zoomColorTo(color) {
      return this.animate('newColor', [...color, this.size],
        shape => { shape.newColor = [...color, 0]; },
        shape => { shape.color = [...color]; shape.newColor = undefined; }
      );
    }

    zoomIn() {
      return this.animate('zoomedSize', [this.size, this.textSize],
        shape => { shape.visible = true; shape.zoomedSize = [0, 0]; },
        shape => { shape.zoomedSize = undefined; }
      );
    }

    zoomOut() {
      return this.animate('zoomedSize', [0, 0],
        shape => { shape.zoomedSize = [this.size, this.textSize]; },
        shape => { shape.visible = false; shape.zoomedSize = undefined; }
      );
    }
  }

  static Square = class extends CSanim.Node {
    constructor(csa, position, size) {
      super(csa, position, size, () => Math.ceil(Math.ceil(this.size / this.ratio) / 1.5));
    }
  };

  static Circle = class extends CSanim.Node {
    constructor(csa, position, size) {
      super(csa, position, size, () => Math.ceil(this.size / 2));
    }
  };

  static Text = class extends CSanim.#Shape {
    constructor(csa, position, text) {
      super(csa);
      this.position = [...position];
      this.text = text;
      this.textSize = 20;
      this.textColor = CSanim.WHITE;
      this.align = 'center';
    }

    draw(p5) {
      const drawText = text => {
        let textNorm = '';
        let textBold = '';
        let textItal = '';
        let insideBold = false;
        let insideItal = false;
        for (let i = 0; i < text.length; i++) {
          if (text[i] === '*' && text[i + 1] === '*') {
            insideBold = !insideBold;
            i++;
          }
          else if (text[i] === '_' && text[i + 1] === '_') {
            insideItal = !insideItal;
            i++;
          }
          else {
            textNorm += insideBold || insideItal ? ' ' : text[i];
            textBold += insideBold ? text[i] : ' ';
            textItal += insideItal ? text[i] : ' ';
          }
        }
        p5.textSize(this.textSize);
        p5.text(textNorm, ...this.position);
        p5.textStyle(p5.BOLD);
        p5.text(textBold, ...this.position);
        p5.textStyle(p5.ITALIC);
        p5.text(textItal, ...this.position);
        p5.textStyle(p5.NORMAL);
      };
      p5.textSize(this.textSize);
      if (this.align === 'left') {
        p5.textAlign(p5.LEFT, p5.TOP);
      }
      if (this.newText != null) {
        p5.fill(...this.textColor, 255 - this.newTextOpacity);
        drawText(this.text);
        p5.fill(...this.textColor, this.newTextOpacity);
        drawText(this.newText);
      }
      else {
        p5.fill(...this.textColor, this.opacity == null ? 255 : this.opacity);
        drawText(this.text);
      }
      if (this.align === 'left') {
        p5.textAlign(p5.CENTER, p5.CENTER);
      }
    }
  };

  static Line = class extends CSanim.#Shape {
    constructor(csa, beg, end) {
      super(csa);
      this.beg = [...beg];
      this.end = [...end];
      this.weight = 3;
      this.textSize = 15;
      this.textBoxColor = CSanim.OLDLACE;
      this.arrow = false;
    }

    draw(p5) {
      p5.stroke(...this.color, this.opacity == null ? 255 : this.opacity);
      p5.strokeWeight(this.weight);
      p5.line(...this.beg, ...this.end);
      const angle = p5.atan2(this.end[1] - this.beg[1], this.end[0] - this.beg[0]);
      if (this.arrow) {
        p5.translate(+this.end[0], +this.end[1]);
        p5.rotate(+(angle - 150));
        p5.line(0, 0, 7.5, 0);
        p5.rotate(-(angle - 150));
        p5.rotate(+(angle + 150));
        p5.line(0, 0, 7.5, 0);
        p5.rotate(-(angle + 150));
        if (this.newColor != null) {
          p5.stroke(this.newColor[0], this.newColor[1], this.newColor[2], this.newColor[7]);
          p5.rotate(+(angle - 150));
          p5.line(0, 0, 7.5, 0);
          p5.rotate(-(angle - 150));
          p5.rotate(+(angle + 150));
          p5.line(0, 0, 7.5, 0);
          p5.rotate(-(angle + 150));
        }
        p5.translate(-this.end[0], -this.end[1]);
      }
      if (this.newColor != null) {
        p5.stroke(this.newColor[0], this.newColor[1], this.newColor[2]);
        p5.line(this.newColor[3], this.newColor[4], this.newColor[5], this.newColor[6]);
      }
      p5.noStroke();
      const center = [
        (this.beg[0] + this.end[0]) / 2,
        (this.beg[1] + this.end[1]) / 2
      ];
      p5.translate(+center[0], +center[1]);
      p5.rotate(+angle);
      p5.textSize(this.textSize);
      if (this.newText != null) {
        p5.fill(...this.textBoxColor, 255 - this.newTextOpacity);
        p5.rect(0, 0, this.text === '' ? 0 : this.text.length * this.textSize / 2 + 25, this.textSize + 5, this.weight);
        p5.fill(...this.textColor, 255 - this.newTextOpacity);
        p5.text(this.text, 0, 0);
        p5.fill(...this.textBoxColor, this.newTextOpacity);
        p5.rect(0, 0, this.newText === '' ? 0 : this.newText.length * this.textSize / 2 + 25, this.textSize + 5, this.weight);
        p5.fill(...this.textColor, this.newTextOpacity);
        p5.text(this.newText, 0, 0);
      }
      else {
        p5.fill(...this.textBoxColor, this.opacity == null ? 255 : this.opacity);
        p5.rect(0, 0, this.text === '' ? 0 : this.text.length * this.textSize / 2 + 25, this.textSize + 5, this.weight);
        p5.fill(...this.textColor, this.opacity == null ? 255 : this.opacity);
        p5.text(this.text, 0, 0);
      }
      p5.rotate(-angle);
      p5.translate(-center[0], -center[1]);
    }

    changeTextTo(text) {
      return this.animate('newTextOpacity', 255,
        shape => { shape.newText = text; shape.newTextOpacity = 0; },
        shape => { shape.text = text; shape.newText = undefined; shape.newTextOpacity = undefined; }
      );
    }

    zoomIn() {
      return this.animate('end', [...this.end], shape => {
        shape.visible = true;
        shape.end = [...this.beg];
      });
    }

    zoomOut() {
      return this.animate('beg', [...this.end], () => { }, shape => {
        shape.visible = false;
        shape.beg = [...this.beg];
      });
    }

    zoomColorToEnd(color) {
      return this.animate('newColor', [...color, ...this.beg, ...this.end, 255],
        shape => { shape.newColor = [...color, ...this.beg, ...this.beg, 0]; },
        shape => { shape.color = [...color]; shape.newColor = undefined; }
      );
    }

    zoomColorToBeg(color) {
      return this.animate('newColor', [...color, ...this.beg, ...this.end, 255],
        shape => { shape.newColor = [...color, ...this.end, ...this.end, 0]; },
        shape => { shape.color = [...color]; shape.newColor = undefined; }
      );
    }
  };

  static Rectangle = class extends CSanim.#Shape {
    constructor(csa, position, width, height) {
      super(csa);
      this.position = [...position];
      this.width = width;
      this.height = height;
      this.ratio = 5;
    }

    draw(p5) {
      p5.fill(...this.color, this.opacity == null ? 255 : this.opacity);
      p5.rect(...this.position, this.width, this.height, Math.min(this.width, this.height) / this.ratio);
    }
  }

  play(animations, duration = .25) {
    if (animations.length == null) {
      animations = [animations];
    }
    for (const animation of animations) {
      if (typeof animation.delay === 'function') animation.delay = 0;
      if (typeof animation.duration === 'function') animation.duration = duration;
      animation.delay = Math.ceil(animation.delay * 60);
      animation.duration = Math.ceil(animation.duration * 60);
    }
    duration = Math.ceil(duration * 60);
    const totalDuration = animations.reduce((max, animation) => (
      Math.max(max, animation.delay + animation.duration)
    ), duration);

    for (let i = 0; i < totalDuration; i++) {
      this.frames.push([]);
      for (const shape of this.shapes) {
        const clone = Object.assign(Object.create(Object.getPrototypeOf(shape)), shape);
        for (const prop in shape) {
          if (typeof shape[prop] === 'object') {
            clone[prop] = [...shape[prop]];
          }
        }
        this.frames[this.frames.length - 1].push(clone);
      }
    }

    for (const animation of animations) {
      for (let i = animation.delay; i < totalDuration; i++) {
        const frame = this.frames[this.frames.length - totalDuration + i];
        animation.begFun(frame[animation.shape.id]);
      }
      for (let i = animation.delay + animation.duration; i < totalDuration; i++) {
        const frame = this.frames[this.frames.length - totalDuration + i];
        frame[animation.shape.id][animation.prop] = (
          typeof animation.value === 'object' ? [...animation.value] : animation.value
        );
        animation.endFun(frame[animation.shape.id]);
      }
    }

    for (const animation of animations) {
      animation.begFun(animation.shape);
      for (let i = animation.delay; i < animation.delay + animation.duration; i++) {
        const frame = this.frames[this.frames.length - totalDuration + i];
        if (typeof animation.value === 'object') {
          for (let j = 0; j < animation.value.length; j++) {
            frame[animation.shape.id][animation.prop][j] = CSanim.easingMap(
              i - animation.delay, 0, animation.duration,
              animation.shape[animation.prop][j],
              animation.value[j]
            );
          }
        }
        else {
          frame[animation.shape.id][animation.prop] = CSanim.easingMap(
            i - animation.delay, 0, animation.duration,
            animation.shape[animation.prop],
            animation.value
          );
        }
      }
      animation.shape[animation.prop] = (
        typeof animation.value === 'object' ? [...animation.value] : animation.value
      );
      animation.endFun(animation.shape);
    }

    for (let i = 0; i < totalDuration; i++) {
      this.frames[this.frames.length - totalDuration + i].sort((a, b) => {
        if (a.zIndex !== b.zIndex) {
          return a.zIndex - b.zIndex;
        }
        return a.id - b.id;
      });
    }
  }

  wait(duration = 1) {
    this.play([], duration);
  }

  saveScreen() {
    this.toSave = this.frames.length - 1;
  }

  run(p5) {
    let active = false;
    let paused = false;
    p5.setup = () => {
      p5.createCanvas(this.w, this.h);
      p5.noStroke();
      p5.angleMode(p5.DEGREES);
      p5.rectMode(p5.CENTER);
      p5.ellipseMode(p5.CENTER);
      p5.textAlign(p5.CENTER, p5.CENTER);
      p5.textFont('Source Code Pro');
    };

    let fps = 1;
    let crtFrame = 0;
    p5.draw = () => {
      p5.background(paused ? 75 : 30);
      if (!active) {
        p5.fill(...CSanim.BLUE);
        p5.circle(this.w / 2, this.h / 2, 70);
        p5.fill(250);
        p5.triangle(
          this.w / 2 - 12, this.h / 2 - 20,
          this.w / 2 - 12, this.h / 2 + 20,
          this.w / 2 + 22, this.h / 2
        );
        p5.cursor(p5.HAND);
      }
      else {
        for (const shape of this.frames[crtFrame]) {
          if (shape.visible) {
            shape.draw(p5);
          }
        }
        if (crtFrame === this.toSave) {
          p5.save('ss.png');
        }
        crtFrame += fps;
        if (crtFrame >= this.frames.length) {
          active = false;
        }
      }
    };

    p5.mousePressed = () => {
      if (!active) {
        crtFrame = 0;
        p5.cursor(p5.ARROW);
        active = true;
      }
      else {
        if (paused) {
          p5.loop();
          paused = false;
        }
        else {
          p5.noLoop();
          paused = true;
        }
      }
    };

    p5.keyPressed = () => {
      if (active && !paused) {
        if (p5.keyCode === p5.LEFT_ARROW) {
          crtFrame = Math.max(crtFrame - 180, 0);
        }
        if (p5.keyCode === p5.RIGHT_ARROW) {
          crtFrame = Math.min(crtFrame + 180, this.frames.length - 1);
        }
        if (p5.keyCode === p5.UP_ARROW) {
          fps = Math.min(fps + 1, 5);
        }
        if (p5.keyCode === p5.DOWN_ARROW) {
          fps = Math.max(fps - 1, 1);
        }
      }
    };
  }
};
