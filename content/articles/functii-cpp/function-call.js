export default function FunctionCall(p5) {
  const code = [
    '#include <iostream>',
    'using namespace std;',
    '',
    'int gcd(int a, int b) {',
    '    int r;',
    '    while (b) {',
    '        r = a % b;',
    '        a = b;',
    '        b = r;',
    '    }',
    '    return a;',
    '}',
    '',
    'int lcm(int a, int b) {',
    '    return a * b / gcd(a, b);',
    '}',
    '',
    'int main() {',
    '    int a = 20, b = 24, c = 1, d = 2;',
    '    int gcdAB = gcd(a, b); a /= gcdAB; b /= gcdAB;',
    '    int gcdCD = gcd(c, d); c /= gcdCD; d /= gcdCD;',
    '    int lcmBD = lcm(b, d);',
    '    a *= lcmBD / b;',
    '    c *= lcmBD / d;',
    '    int e = a + c;',
    '    int f = lcmBD;',
    '    int gcdEF = gcd(e, f);',
    '    e /= gcdEF;',
    '    f /= gcdEF;',
    '    cout << e << " / " << f << \'\\n\';',
    '    return 0;',
    '}'
  ];

  class State {
    constructor(line, left, right, stack) {
      this.line = line;
      this.left = left;
      this.right = right;
      this.stack = [...stack];
    }
  }

  let frame = 0;
  let queue = [];

  let frames = 0;
  let paused = false;
  let active = false;

  p5.setup = () => {
    p5.createCanvas(470, 420);
    p5.textFont('Source Code Pro');
    p5.textAlign(p5.LEFT, p5.CENTER);
    p5.noStroke();

    queue.push(new State(-5,  0,  0, []));
    queue.push(new State(18,  1, 12, []));
    queue.push(new State(18,  1, 12, [['main:']]));
    queue.push(new State(19,  5, 14, [['main:']]));
    queue.push(new State(19,  5, 14, [['main:', 'a = 20']]));
    queue.push(new State(19, 17, 22, [['main:', 'a = 20']]));
    queue.push(new State(19, 17, 22, [['main:', 'a = 20', 'b = 24']]));
    queue.push(new State(19, 25, 29, [['main:', 'a = 20', 'b = 24']]));
    queue.push(new State(19, 25, 29, [['main:', 'a = 20', 'b = 24', 'c = 1']]));
    queue.push(new State(19, 32, 36, [['main:', 'a = 20', 'b = 24', 'c = 1']]));
    queue.push(new State(19, 32, 36, [['main:', 'a = 20', 'b = 24', 'c = 1', 'd = 2']]));
    queue.push(new State(20,  5, 13, [['main:', 'a = 20', 'b = 24', 'c = 1', 'd = 2']]));
    queue.push(new State(20,  5, 13, [['main:', 'a = 20', 'b = 24', 'c = 1', 'd = 2', 'gcdAB = ?']]));
    queue.push(new State(20, 17, 25, [['main:', 'a = 20', 'b = 24', 'c = 1', 'd = 2', 'gcdAB = ?']]));

    queue.push(new State( 4,  1, 23, [['main:', 'a = 20', 'b = 24', 'c = 1', 'd = 2', 'gcdAB = ?']]));
    queue.push(new State( 4,  1, 23, [['main:', 'a = 20', 'b = 24', 'c = 1', 'd = 2', 'gcdAB = ?'], ['gcd:', 'a = 20', 'b = 24']]));
    queue.push(new State( 5,  5, 10, [['main:', 'a = 20', 'b = 24', 'c = 1', 'd = 2', 'gcdAB = ?'], ['gcd:', 'a = 20', 'b = 24']]));
    queue.push(new State( 5,  5, 10, [['main:', 'a = 20', 'b = 24', 'c = 1', 'd = 2', 'gcdAB = ?'], ['gcd:', 'a = 20', 'b = 24', 'r = 749382']]));
    queue.push(new State( 6,  5, 15, [['main:', 'a = 20', 'b = 24', 'c = 1', 'd = 2', 'gcdAB = ?'], ['gcd:', 'a = 20', 'b = 24', 'r = 749382']]));
    queue.push(new State( 7,  9, 18, [['main:', 'a = 20', 'b = 24', 'c = 1', 'd = 2', 'gcdAB = ?'], ['gcd:', 'a = 20', 'b = 24', 'r = 749382']]));
    queue.push(new State( 7,  9, 18, [['main:', 'a = 20', 'b = 24', 'c = 1', 'd = 2', 'gcdAB = ?'], ['gcd:', 'a = 20', 'b = 24', 'r = 20']]));
    queue.push(new State( 8,  9, 14, [['main:', 'a = 20', 'b = 24', 'c = 1', 'd = 2', 'gcdAB = ?'], ['gcd:', 'a = 20', 'b = 24', 'r = 20']]));
    queue.push(new State( 8,  9, 14, [['main:', 'a = 20', 'b = 24', 'c = 1', 'd = 2', 'gcdAB = ?'], ['gcd:', 'a = 24', 'b = 24', 'r = 20']]));
    queue.push(new State( 9,  9, 14, [['main:', 'a = 20', 'b = 24', 'c = 1', 'd = 2', 'gcdAB = ?'], ['gcd:', 'a = 24', 'b = 24', 'r = 20']]));
    queue.push(new State( 9,  9, 14, [['main:', 'a = 20', 'b = 24', 'c = 1', 'd = 2', 'gcdAB = ?'], ['gcd:', 'a = 24', 'b = 20', 'r = 20']]));
    queue.push(new State( 6,  5, 15, [['main:', 'a = 20', 'b = 24', 'c = 1', 'd = 2', 'gcdAB = ?'], ['gcd:', 'a = 24', 'b = 20', 'r = 20']]));
    queue.push(new State( 7,  9, 18, [['main:', 'a = 20', 'b = 24', 'c = 1', 'd = 2', 'gcdAB = ?'], ['gcd:', 'a = 24', 'b = 20', 'r = 20']]));
    queue.push(new State( 7,  9, 18, [['main:', 'a = 20', 'b = 24', 'c = 1', 'd = 2', 'gcdAB = ?'], ['gcd:', 'a = 24', 'b = 20', 'r = 4']]));
    queue.push(new State( 8,  9, 14, [['main:', 'a = 20', 'b = 24', 'c = 1', 'd = 2', 'gcdAB = ?'], ['gcd:', 'a = 24', 'b = 20', 'r = 4']]));
    queue.push(new State( 8,  9, 14, [['main:', 'a = 20', 'b = 24', 'c = 1', 'd = 2', 'gcdAB = ?'], ['gcd:', 'a = 20', 'b = 20', 'r = 4']]));
    queue.push(new State( 9,  9, 14, [['main:', 'a = 20', 'b = 24', 'c = 1', 'd = 2', 'gcdAB = ?'], ['gcd:', 'a = 20', 'b = 20', 'r = 4']]));
    queue.push(new State( 9,  9, 14, [['main:', 'a = 20', 'b = 24', 'c = 1', 'd = 2', 'gcdAB = ?'], ['gcd:', 'a = 20', 'b = 4', 'r = 4']]));
    queue.push(new State( 6,  5, 15, [['main:', 'a = 20', 'b = 24', 'c = 1', 'd = 2', 'gcdAB = ?'], ['gcd:', 'a = 20', 'b = 4', 'r = 4']]));
    queue.push(new State( 7,  9, 18, [['main:', 'a = 20', 'b = 24', 'c = 1', 'd = 2', 'gcdAB = ?'], ['gcd:', 'a = 20', 'b = 4', 'r = 4']]));
    queue.push(new State( 7,  9, 18, [['main:', 'a = 20', 'b = 24', 'c = 1', 'd = 2', 'gcdAB = ?'], ['gcd:', 'a = 20', 'b = 4', 'r = 0']]));
    queue.push(new State( 8,  9, 14, [['main:', 'a = 20', 'b = 24', 'c = 1', 'd = 2', 'gcdAB = ?'], ['gcd:', 'a = 20', 'b = 4', 'r = 0']]));
    queue.push(new State( 8,  9, 14, [['main:', 'a = 20', 'b = 24', 'c = 1', 'd = 2', 'gcdAB = ?'], ['gcd:', 'a = 4', 'b = 4', 'r = 0']]));
    queue.push(new State( 9,  9, 14, [['main:', 'a = 20', 'b = 24', 'c = 1', 'd = 2', 'gcdAB = ?'], ['gcd:', 'a = 4', 'b = 4', 'r = 0']]));
    queue.push(new State( 9,  9, 14, [['main:', 'a = 20', 'b = 24', 'c = 1', 'd = 2', 'gcdAB = ?'], ['gcd:', 'a = 4', 'b = 0', 'r = 0']]));
    queue.push(new State( 6,  5, 15, [['main:', 'a = 20', 'b = 24', 'c = 1', 'd = 2', 'gcdAB = ?'], ['gcd:', 'a = 4', 'b = 0', 'r = 0']]));
    queue.push(new State(11,  5, 13, [['main:', 'a = 20', 'b = 24', 'c = 1', 'd = 2', 'gcdAB = ?'], ['gcd:', 'a = 4', 'b = 0', 'r = 0']]));
    queue.push(new State(11,  5, 13, [['main:', 'a = 20', 'b = 24', 'c = 1', 'd = 2', 'gcdAB = 4'], ['gcd:', 'a = 4', 'b = 0', 'r = 0']]));
    queue.push(new State(11,  5, 13, [['main:', 'a = 20', 'b = 24', 'c = 1', 'd = 2', 'gcdAB = 4']]));
    queue.push(new State(20, 17, 25, [['main:', 'a = 20', 'b = 24', 'c = 1', 'd = 2', 'gcdAB = 4']]));

    queue.push(new State(20, 28, 38, [['main:', 'a = 20', 'b = 24', 'c = 1', 'd = 2', 'gcdAB = 4']]));
    queue.push(new State(20, 28, 38, [['main:', 'a = 5', 'b = 24', 'c = 1', 'd = 2', 'gcdAB = 4']]));
    queue.push(new State(20, 40, 50, [['main:', 'a = 5', 'b = 24', 'c = 1', 'd = 2', 'gcdAB = 4']]));
    queue.push(new State(20, 40, 50, [['main:', 'a = 5', 'b = 6', 'c = 1', 'd = 2', 'gcdAB = 4']]));
    queue.push(new State(21,  5, 13, [['main:', 'a = 5', 'b = 6', 'c = 1', 'd = 2', 'gcdAB = 4']]));
    queue.push(new State(21,  5, 13, [['main:', 'a = 5', 'b = 6', 'c = 1', 'd = 2', 'gcdAB = 4', 'gcdCD = ?']]));
    queue.push(new State(21, 17, 25, [['main:', 'a = 5', 'b = 6', 'c = 1', 'd = 2', 'gcdAB = 4', 'gcdCD = ?']]));

    queue.push(new State( 4,  1, 23, [['main:', 'a = 5', 'b = 6', 'c = 1', 'd = 2', 'gcdAB = 4', 'gcdCD = ?']]));
    queue.push(new State( 4,  1, 23, [['main:', 'a = 5', 'b = 6', 'c = 1', 'd = 2', 'gcdAB = 4', 'gcdCD = ?'], ['gcd:', 'a = 1', 'b = 2']]));
    queue.push(new State( 5,  5, 10, [['main:', 'a = 5', 'b = 6', 'c = 1', 'd = 2', 'gcdAB = 4', 'gcdCD = ?'], ['gcd:', 'a = 1', 'b = 2']]));
    queue.push(new State( 5,  5, 10, [['main:', 'a = 5', 'b = 6', 'c = 1', 'd = 2', 'gcdAB = 4', 'gcdCD = ?'], ['gcd:', 'a = 1', 'b = 2', 'r = 428191']]));
    queue.push(new State( 6,  5, 15, [['main:', 'a = 5', 'b = 6', 'c = 1', 'd = 2', 'gcdAB = 4', 'gcdCD = ?'], ['gcd:', 'a = 1', 'b = 2', 'r = 428191']]));
    queue.push(new State( 7,  9, 18, [['main:', 'a = 5', 'b = 6', 'c = 1', 'd = 2', 'gcdAB = 4', 'gcdCD = ?'], ['gcd:', 'a = 1', 'b = 2', 'r = 428191']]));
    queue.push(new State( 7,  9, 18, [['main:', 'a = 5', 'b = 6', 'c = 1', 'd = 2', 'gcdAB = 4', 'gcdCD = ?'], ['gcd:', 'a = 1', 'b = 2', 'r = 1']]));
    queue.push(new State( 8,  9, 14, [['main:', 'a = 5', 'b = 6', 'c = 1', 'd = 2', 'gcdAB = 4', 'gcdCD = ?'], ['gcd:', 'a = 1', 'b = 2', 'r = 1']]));
    queue.push(new State( 8,  9, 14, [['main:', 'a = 5', 'b = 6', 'c = 1', 'd = 2', 'gcdAB = 4', 'gcdCD = ?'], ['gcd:', 'a = 2', 'b = 2', 'r = 1']]));
    queue.push(new State( 9,  9, 14, [['main:', 'a = 5', 'b = 6', 'c = 1', 'd = 2', 'gcdAB = 4', 'gcdCD = ?'], ['gcd:', 'a = 2', 'b = 2', 'r = 1']]));
    queue.push(new State( 9,  9, 14, [['main:', 'a = 5', 'b = 6', 'c = 1', 'd = 2', 'gcdAB = 4', 'gcdCD = ?'], ['gcd:', 'a = 2', 'b = 1', 'r = 1']]));
    queue.push(new State( 6,  5, 15, [['main:', 'a = 5', 'b = 6', 'c = 1', 'd = 2', 'gcdAB = 4', 'gcdCD = ?'], ['gcd:', 'a = 2', 'b = 1', 'r = 1']]));
    queue.push(new State( 7,  9, 18, [['main:', 'a = 5', 'b = 6', 'c = 1', 'd = 2', 'gcdAB = 4', 'gcdCD = ?'], ['gcd:', 'a = 2', 'b = 1', 'r = 1']]));
    queue.push(new State( 7,  9, 18, [['main:', 'a = 5', 'b = 6', 'c = 1', 'd = 2', 'gcdAB = 4', 'gcdCD = ?'], ['gcd:', 'a = 2', 'b = 1', 'r = 0']]));
    queue.push(new State( 8,  9, 14, [['main:', 'a = 5', 'b = 6', 'c = 1', 'd = 2', 'gcdAB = 4', 'gcdCD = ?'], ['gcd:', 'a = 2', 'b = 1', 'r = 0']]));
    queue.push(new State( 8,  9, 14, [['main:', 'a = 5', 'b = 6', 'c = 1', 'd = 2', 'gcdAB = 4', 'gcdCD = ?'], ['gcd:', 'a = 1', 'b = 1', 'r = 0']]));
    queue.push(new State( 9,  9, 14, [['main:', 'a = 5', 'b = 6', 'c = 1', 'd = 2', 'gcdAB = 4', 'gcdCD = ?'], ['gcd:', 'a = 1', 'b = 1', 'r = 0']]));
    queue.push(new State( 9,  9, 14, [['main:', 'a = 5', 'b = 6', 'c = 1', 'd = 2', 'gcdAB = 4', 'gcdCD = ?'], ['gcd:', 'a = 1', 'b = 0', 'r = 0']]));
    queue.push(new State( 6,  5, 15, [['main:', 'a = 5', 'b = 6', 'c = 1', 'd = 2', 'gcdAB = 4', 'gcdCD = ?'], ['gcd:', 'a = 1', 'b = 0', 'r = 0']]));
    queue.push(new State(11,  5, 13, [['main:', 'a = 5', 'b = 6', 'c = 1', 'd = 2', 'gcdAB = 4', 'gcdCD = ?'], ['gcd:', 'a = 1', 'b = 0', 'r = 0']]));
    queue.push(new State(11,  5, 13, [['main:', 'a = 5', 'b = 6', 'c = 1', 'd = 2', 'gcdAB = 4', 'gcdCD = 1'], ['gcd:', 'a = 1', 'b = 0', 'r = 0']]));
    queue.push(new State(11,  5, 13, [['main:', 'a = 5', 'b = 6', 'c = 1', 'd = 2', 'gcdAB = 4', 'gcdCD = 1']]));
    queue.push(new State(21, 17, 25, [['main:', 'a = 5', 'b = 6', 'c = 1', 'd = 2', 'gcdAB = 4', 'gcdCD = 1']]));

    queue.push(new State(21, 28, 38, [['main:', 'a = 5', 'b = 6', 'c = 1', 'd = 2', 'gcdAB = 4', 'gcdCD = 1']]));
    queue.push(new State(21, 28, 38, [['main:', 'a = 5', 'b = 6', 'c = 1', 'd = 2', 'gcdAB = 4', 'gcdCD = 1']]));
    queue.push(new State(21, 40, 50, [['main:', 'a = 5', 'b = 6', 'c = 1', 'd = 2', 'gcdAB = 4', 'gcdCD = 1']]));
    queue.push(new State(21, 40, 50, [['main:', 'a = 5', 'b = 6', 'c = 1', 'd = 2', 'gcdAB = 4', 'gcdCD = 1']]));
    queue.push(new State(22, 5, 13, [['main:', 'a = 5', 'b = 6', 'c = 1', 'd = 2', 'gcdAB = 4', 'gcdCD = 1']]));
    queue.push(new State(22, 5, 13, [['main:', 'a = 5', 'b = 6', 'c = 1', 'd = 2', 'gcdAB = 4', 'gcdCD = 1', 'lcmBD = ?']]));
    queue.push(new State(22, 17, 25, [['main:', 'a = 5', 'b = 6', 'c = 1', 'd = 2', 'gcdAB = 4', 'gcdCD = 1', 'lcmBD = ?']]));

    queue.push(new State(14,  1, 23, [['main:', 'a = 5', 'b = 6', 'c = 1', 'd = 2', 'gcdAB = 4', 'gcdCD = 1', 'lcmBD = ?']]));
    queue.push(new State(14,  1, 23, [['main:', 'a = 5', 'b = 6', 'c = 1', 'd = 2', 'gcdAB = 4', 'gcdCD = 1', 'lcmBD = ?'], ['lcm:', 'a = 6', 'b = 1']]));
    queue.push(new State(15, 20, 28, [['main:', 'a = 5', 'b = 6', 'c = 1', 'd = 2', 'gcdAB = 4', 'gcdCD = 1', 'lcmBD = ?'], ['lcm:', 'a = 6', 'b = 1']]));

    queue.push(new State( 4,  1, 23, [['main:', 'a = 5', 'b = 6', 'c = 1', 'd = 2', 'gcdAB = 4', 'gcdCD = 1', 'lcmBD = ?'], ['lcm:', 'a = 6', 'b = 1']]));
    queue.push(new State( 4,  1, 23, [['main:', 'a = 5', 'b = 6', 'c = 1', 'd = 2', 'gcdAB = 4', 'gcdCD = 1', 'lcmBD = ?'], ['lcm:', 'a = 6', 'b = 1'], ['gcd:', 'a = 6', 'b = 1']]));
    queue.push(new State( 5,  5, 10, [['main:', 'a = 5', 'b = 6', 'c = 1', 'd = 2', 'gcdAB = 4', 'gcdCD = 1', 'lcmBD = ?'], ['lcm:', 'a = 6', 'b = 1'], ['gcd:', 'a = 6', 'b = 1']]));
    queue.push(new State( 5,  5, 10, [['main:', 'a = 5', 'b = 6', 'c = 1', 'd = 2', 'gcdAB = 4', 'gcdCD = 1', 'lcmBD = ?'], ['lcm:', 'a = 6', 'b = 1'], ['gcd:', 'a = 6', 'b = 1', 'r = 786261']]));
    queue.push(new State( 6,  5, 15, [['main:', 'a = 5', 'b = 6', 'c = 1', 'd = 2', 'gcdAB = 4', 'gcdCD = 1', 'lcmBD = ?'], ['lcm:', 'a = 6', 'b = 1'], ['gcd:', 'a = 6', 'b = 1', 'r = 786261']]));
    queue.push(new State( 7,  9, 18, [['main:', 'a = 5', 'b = 6', 'c = 1', 'd = 2', 'gcdAB = 4', 'gcdCD = 1', 'lcmBD = ?'], ['lcm:', 'a = 6', 'b = 1'], ['gcd:', 'a = 6', 'b = 1', 'r = 786261']]));
    queue.push(new State( 7,  9, 18, [['main:', 'a = 5', 'b = 6', 'c = 1', 'd = 2', 'gcdAB = 4', 'gcdCD = 1', 'lcmBD = ?'], ['lcm:', 'a = 6', 'b = 1'], ['gcd:', 'a = 6', 'b = 1', 'r = 0']]));
    queue.push(new State( 8,  9, 14, [['main:', 'a = 5', 'b = 6', 'c = 1', 'd = 2', 'gcdAB = 4', 'gcdCD = 1', 'lcmBD = ?'], ['lcm:', 'a = 6', 'b = 1'], ['gcd:', 'a = 6', 'b = 1', 'r = 0']]));
    queue.push(new State( 8,  9, 14, [['main:', 'a = 5', 'b = 6', 'c = 1', 'd = 2', 'gcdAB = 4', 'gcdCD = 1', 'lcmBD = ?'], ['lcm:', 'a = 6', 'b = 1'], ['gcd:', 'a = 1', 'b = 1', 'r = 0']]));
    queue.push(new State( 9,  9, 14, [['main:', 'a = 5', 'b = 6', 'c = 1', 'd = 2', 'gcdAB = 4', 'gcdCD = 1', 'lcmBD = ?'], ['lcm:', 'a = 6', 'b = 1'], ['gcd:', 'a = 1', 'b = 1', 'r = 0']]));
    queue.push(new State( 9,  9, 14, [['main:', 'a = 5', 'b = 6', 'c = 1', 'd = 2', 'gcdAB = 4', 'gcdCD = 1', 'lcmBD = ?'], ['lcm:', 'a = 6', 'b = 1'], ['gcd:', 'a = 1', 'b = 0', 'r = 0']]));
    queue.push(new State( 6,  5, 15, [['main:', 'a = 5', 'b = 6', 'c = 1', 'd = 2', 'gcdAB = 4', 'gcdCD = 1', 'lcmBD = ?'], ['lcm:', 'a = 6', 'b = 1'], ['gcd:', 'a = 1', 'b = 0', 'r = 0']]));
    queue.push(new State(11,  5, 13, [['main:', 'a = 5', 'b = 6', 'c = 1', 'd = 2', 'gcdAB = 4', 'gcdCD = 1', 'lcmBD = ?'], ['lcm:', 'a = 6', 'b = 1'], ['gcd:', 'a = 1', 'b = 0', 'r = 0']]));
    queue.push(new State(11,  5, 13, [['main:', 'a = 5', 'b = 6', 'c = 1', 'd = 2', 'gcdAB = 4', 'gcdCD = 1', 'lcmBD = ?'], ['lcm:', 'a = 6', 'b = 1']]));

    queue.push(new State(15, 20, 28, [['main:', 'a = 5', 'b = 6', 'c = 1', 'd = 2', 'gcdAB = 4', 'gcdCD = 1', 'lcmBD = ?'], ['lcm:', 'a = 6', 'b = 1']]));
    queue.push(new State(15, 20, 28, [['main:', 'a = 5', 'b = 6', 'c = 1', 'd = 2', 'gcdAB = 4', 'gcdCD = 1', 'lcmBD = 6'], ['lcm:', 'a = 6', 'b = 1']]));
    queue.push(new State(15, 20, 28, [['main:', 'a = 5', 'b = 6', 'c = 1', 'd = 2', 'gcdAB = 4', 'gcdCD = 1', 'lcmBD = 6']]));
    queue.push(new State(22, 17, 25, [['main:', 'a = 5', 'b = 6', 'c = 1', 'd = 2', 'gcdAB = 4', 'gcdCD = 1', 'lcmBD = 6']]));

    queue.push(new State(23,  5, 19, [['main:', 'a = 5', 'b = 6', 'c = 1', 'd = 2', 'gcdAB = 4', 'gcdCD = 1', 'lcmBD = 6']]));
    queue.push(new State(23,  5, 19, [['main:', 'a = 5', 'b = 6', 'c = 1', 'd = 2', 'gcdAB = 4', 'gcdCD = 1', 'lcmBD = 6']]));
    queue.push(new State(24,  5, 19, [['main:', 'a = 5', 'b = 6', 'c = 1', 'd = 2', 'gcdAB = 4', 'gcdCD = 1', 'lcmBD = 6']]));
    queue.push(new State(24,  5, 19, [['main:', 'a = 5', 'b = 6', 'c = 3', 'd = 2', 'gcdAB = 4', 'gcdCD = 1', 'lcmBD = 6']]));

    queue.push(new State(25,  5, 18, [['main:', 'a = 5', 'b = 6', 'c = 3', 'd = 2', 'gcdAB = 4', 'gcdCD = 1', 'lcmBD = 6']]));
    queue.push(new State(25,  5, 18, [['main:', 'a = 5', 'b = 6', 'c = 3', 'd = 2', 'gcdAB = 4', 'gcdCD = 1', 'lcmBD = 6', 'e = 11']]));
    queue.push(new State(26,  5, 18, [['main:', 'a = 5', 'b = 6', 'c = 3', 'd = 2', 'gcdAB = 4', 'gcdCD = 1', 'lcmBD = 6', 'e = 11']]));
    queue.push(new State(26,  5, 18, [['main:', 'a = 5', 'b = 6', 'c = 3', 'd = 2', 'gcdAB = 4', 'gcdCD = 1', 'lcmBD = 6', 'e = 11', 'f = 6']]));
    queue.push(new State(27,  5, 13, [['main:', 'a = 5', 'b = 6', 'c = 3', 'd = 2', 'gcdAB = 4', 'gcdCD = 1', 'lcmBD = 6', 'e = 11', 'f = 6', 'gcdEF = ?']]));
    queue.push(new State(27, 17, 25, [['main:', 'a = 5', 'b = 6', 'c = 3', 'd = 2', 'gcdAB = 4', 'gcdCD = 1', 'lcmBD = 6', 'e = 11', 'f = 6', 'gcdEF = ?']]));

    queue.push(new State( 4,  1, 23, [['main:', 'a = 5', 'b = 6', 'c = 3', 'd = 2', 'gcdAB = 4', 'gcdCD = 1', 'lcmBD = 6', 'e = 11', 'f = 6', 'gcdEF = ?']]));
    queue.push(new State( 4,  1, 23, [['main:', 'a = 5', 'b = 6', 'c = 3', 'd = 2', 'gcdAB = 4', 'gcdCD = 1', 'lcmBD = 6', 'e = 11', 'f = 6', 'gcdEF = ?'], ['gcd:', 'a = 11', 'b = 6']]));
    queue.push(new State( 5,  5, 10, [['main:', 'a = 5', 'b = 6', 'c = 3', 'd = 2', 'gcdAB = 4', 'gcdCD = 1', 'lcmBD = 6', 'e = 11', 'f = 6', 'gcdEF = ?'], ['gcd:', 'a = 11', 'b = 6']]));
    queue.push(new State( 5,  5, 10, [['main:', 'a = 5', 'b = 6', 'c = 3', 'd = 2', 'gcdAB = 4', 'gcdCD = 1', 'lcmBD = 6', 'e = 11', 'f = 6', 'gcdEF = ?'], ['gcd:', 'a = 11', 'b = 6', 'r = 212327']]));
    queue.push(new State( 6,  5, 15, [['main:', 'a = 5', 'b = 6', 'c = 3', 'd = 2', 'gcdAB = 4', 'gcdCD = 1', 'lcmBD = 6', 'e = 11', 'f = 6', 'gcdEF = ?'], ['gcd:', 'a = 11', 'b = 6', 'r = 212327']]));
    queue.push(new State( 7,  9, 18, [['main:', 'a = 5', 'b = 6', 'c = 3', 'd = 2', 'gcdAB = 4', 'gcdCD = 1', 'lcmBD = 6', 'e = 11', 'f = 6', 'gcdEF = ?'], ['gcd:', 'a = 11', 'b = 6', 'r = 212327']]));
    queue.push(new State( 7,  9, 18, [['main:', 'a = 5', 'b = 6', 'c = 3', 'd = 2', 'gcdAB = 4', 'gcdCD = 1', 'lcmBD = 6', 'e = 11', 'f = 6', 'gcdEF = ?'], ['gcd:', 'a = 11', 'b = 6', 'r = 5']]));
    queue.push(new State( 8,  9, 14, [['main:', 'a = 5', 'b = 6', 'c = 3', 'd = 2', 'gcdAB = 4', 'gcdCD = 1', 'lcmBD = 6', 'e = 11', 'f = 6', 'gcdEF = ?'], ['gcd:', 'a = 11', 'b = 6', 'r = 5']]));
    queue.push(new State( 8,  9, 14, [['main:', 'a = 5', 'b = 6', 'c = 3', 'd = 2', 'gcdAB = 4', 'gcdCD = 1', 'lcmBD = 6', 'e = 11', 'f = 6', 'gcdEF = ?'], ['gcd:', 'a = 6', 'b = 6', 'r = 5']]));
    queue.push(new State( 9,  9, 14, [['main:', 'a = 5', 'b = 6', 'c = 3', 'd = 2', 'gcdAB = 4', 'gcdCD = 1', 'lcmBD = 6', 'e = 11', 'f = 6', 'gcdEF = ?'], ['gcd:', 'a = 6', 'b = 6', 'r = 5']]));
    queue.push(new State( 9,  9, 14, [['main:', 'a = 5', 'b = 6', 'c = 3', 'd = 2', 'gcdAB = 4', 'gcdCD = 1', 'lcmBD = 6', 'e = 11', 'f = 6', 'gcdEF = ?'], ['gcd:', 'a = 6', 'b = 5', 'r = 5']]));
    queue.push(new State( 6,  5, 15, [['main:', 'a = 5', 'b = 6', 'c = 3', 'd = 2', 'gcdAB = 4', 'gcdCD = 1', 'lcmBD = 6', 'e = 11', 'f = 6', 'gcdEF = ?'], ['gcd:', 'a = 6', 'b = 5', 'r = 5']]));
    queue.push(new State( 7,  9, 18, [['main:', 'a = 5', 'b = 6', 'c = 3', 'd = 2', 'gcdAB = 4', 'gcdCD = 1', 'lcmBD = 6', 'e = 11', 'f = 6', 'gcdEF = ?'], ['gcd:', 'a = 6', 'b = 5', 'r = 5']]));
    queue.push(new State( 7,  9, 18, [['main:', 'a = 5', 'b = 6', 'c = 3', 'd = 2', 'gcdAB = 4', 'gcdCD = 1', 'lcmBD = 6', 'e = 11', 'f = 6', 'gcdEF = ?'], ['gcd:', 'a = 6', 'b = 5', 'r = 1']]));
    queue.push(new State( 8,  9, 14, [['main:', 'a = 5', 'b = 6', 'c = 3', 'd = 2', 'gcdAB = 4', 'gcdCD = 1', 'lcmBD = 6', 'e = 11', 'f = 6', 'gcdEF = ?'], ['gcd:', 'a = 6', 'b = 5', 'r = 1']]));
    queue.push(new State( 8,  9, 14, [['main:', 'a = 5', 'b = 6', 'c = 3', 'd = 2', 'gcdAB = 4', 'gcdCD = 1', 'lcmBD = 6', 'e = 11', 'f = 6', 'gcdEF = ?'], ['gcd:', 'a = 5', 'b = 5', 'r = 1']]));
    queue.push(new State( 9,  9, 14, [['main:', 'a = 5', 'b = 6', 'c = 3', 'd = 2', 'gcdAB = 4', 'gcdCD = 1', 'lcmBD = 6', 'e = 11', 'f = 6', 'gcdEF = ?'], ['gcd:', 'a = 5', 'b = 5', 'r = 1']]));
    queue.push(new State( 9,  9, 14, [['main:', 'a = 5', 'b = 6', 'c = 3', 'd = 2', 'gcdAB = 4', 'gcdCD = 1', 'lcmBD = 6', 'e = 11', 'f = 6', 'gcdEF = ?'], ['gcd:', 'a = 5', 'b = 1', 'r = 1']]));
    queue.push(new State( 6,  5, 15, [['main:', 'a = 5', 'b = 6', 'c = 3', 'd = 2', 'gcdAB = 4', 'gcdCD = 1', 'lcmBD = 6', 'e = 11', 'f = 6', 'gcdEF = ?'], ['gcd:', 'a = 5', 'b = 1', 'r = 1']]));
    queue.push(new State( 7,  9, 18, [['main:', 'a = 5', 'b = 6', 'c = 3', 'd = 2', 'gcdAB = 4', 'gcdCD = 1', 'lcmBD = 6', 'e = 11', 'f = 6', 'gcdEF = ?'], ['gcd:', 'a = 5', 'b = 1', 'r = 1']]));
    queue.push(new State( 7,  9, 18, [['main:', 'a = 5', 'b = 6', 'c = 3', 'd = 2', 'gcdAB = 4', 'gcdCD = 1', 'lcmBD = 6', 'e = 11', 'f = 6', 'gcdEF = ?'], ['gcd:', 'a = 5', 'b = 1', 'r = 0']]));
    queue.push(new State( 8,  9, 14, [['main:', 'a = 5', 'b = 6', 'c = 3', 'd = 2', 'gcdAB = 4', 'gcdCD = 1', 'lcmBD = 6', 'e = 11', 'f = 6', 'gcdEF = ?'], ['gcd:', 'a = 5', 'b = 1', 'r = 0']]));
    queue.push(new State( 8,  9, 14, [['main:', 'a = 5', 'b = 6', 'c = 3', 'd = 2', 'gcdAB = 4', 'gcdCD = 1', 'lcmBD = 6', 'e = 11', 'f = 6', 'gcdEF = ?'], ['gcd:', 'a = 1', 'b = 1', 'r = 0']]));
    queue.push(new State( 9,  9, 14, [['main:', 'a = 5', 'b = 6', 'c = 3', 'd = 2', 'gcdAB = 4', 'gcdCD = 1', 'lcmBD = 6', 'e = 11', 'f = 6', 'gcdEF = ?'], ['gcd:', 'a = 1', 'b = 1', 'r = 0']]));
    queue.push(new State( 9,  9, 14, [['main:', 'a = 5', 'b = 6', 'c = 3', 'd = 2', 'gcdAB = 4', 'gcdCD = 1', 'lcmBD = 6', 'e = 11', 'f = 6', 'gcdEF = ?'], ['gcd:', 'a = 1', 'b = 0', 'r = 0']]));
    queue.push(new State( 6,  5, 15, [['main:', 'a = 5', 'b = 6', 'c = 3', 'd = 2', 'gcdAB = 4', 'gcdCD = 1', 'lcmBD = 6', 'e = 11', 'f = 6', 'gcdEF = ?'], ['gcd:', 'a = 1', 'b = 0', 'r = 0']]));
    queue.push(new State(11,  5, 13, [['main:', 'a = 5', 'b = 6', 'c = 3', 'd = 2', 'gcdAB = 4', 'gcdCD = 1', 'lcmBD = 6', 'e = 11', 'f = 6', 'gcdEF = ?'], ['gcd:', 'a = 1', 'b = 0', 'r = 0']]));
    queue.push(new State(11,  5, 13, [['main:', 'a = 5', 'b = 6', 'c = 3', 'd = 2', 'gcdAB = 4', 'gcdCD = 1', 'lcmBD = 6', 'e = 11', 'f = 6', 'gcdEF = 1'], ['gcd:', 'a = 1', 'b = 0', 'r = 0']]));
    queue.push(new State(11,  5, 13, [['main:', 'a = 5', 'b = 6', 'c = 3', 'd = 2', 'gcdAB = 4', 'gcdCD = 1', 'lcmBD = 6', 'e = 11', 'f = 6', 'gcdEF = 1']]));
    queue.push(new State(27, 17, 25, [['main:', 'a = 5', 'b = 6', 'c = 3', 'd = 2', 'gcdAB = 4', 'gcdCD = 1', 'lcmBD = 6', 'e = 11', 'f = 6', 'gcdEF = 1']]));

    queue.push(new State(28, 5, 15, [['main:', 'a = 5', 'b = 6', 'c = 3', 'd = 2', 'gcdAB = 4', 'gcdCD = 1', 'lcmBD = 6', 'e = 11', 'f = 6', 'gcdEF = 1']]));
    queue.push(new State(28, 5, 15, [['main:', 'a = 5', 'b = 6', 'c = 3', 'd = 2', 'gcdAB = 4', 'gcdCD = 1', 'lcmBD = 6', 'e = 11', 'f = 6', 'gcdEF = 1']]));
    queue.push(new State(29, 5, 15, [['main:', 'a = 5', 'b = 6', 'c = 3', 'd = 2', 'gcdAB = 4', 'gcdCD = 1', 'lcmBD = 6', 'e = 11', 'f = 6', 'gcdEF = 1']]));
    queue.push(new State(29, 5, 15, [['main:', 'a = 5', 'b = 6', 'c = 3', 'd = 2', 'gcdAB = 4', 'gcdCD = 1', 'lcmBD = 6', 'e = 11', 'f = 6', 'gcdEF = 1']]));
    queue.push(new State(30, 5, 36, [['main:', 'a = 5', 'b = 6', 'c = 3', 'd = 2', 'gcdAB = 4', 'gcdCD = 1', 'lcmBD = 6', 'e = 11', 'f = 6', 'gcdEF = 1']]));
    queue.push(new State(31, 5, 13, [['main:', 'a = 5', 'b = 6', 'c = 3', 'd = 2', 'gcdAB = 4', 'gcdCD = 1', 'lcmBD = 6', 'e = 11', 'f = 6', 'gcdEF = 1']]));
    queue.push(new State(31, 5, 13, []));
    queue.push(new State(-5,  0,  0, []));
  };

  p5.draw = () => {
    p5.background(paused ? 75 : 30);
    p5.textAlign(p5.LEFT, p5.CENTER);
    p5.textSize(10);

    if (!active) {
      p5.fill(30, 144, 255);
      p5.circle(p5.width / 2, p5.height / 2, 70);
      p5.fill(250);
      p5.triangle(
        p5.width / 2 - 12, p5.height / 2 - 20,
        p5.width / 2 - 12, p5.height / 2 + 20,
        p5.width / 2 + 22, p5.height / 2
      );
      p5.cursor(p5.HAND);
      return;
    }

    const h = p5.textSize() * code.length + 2 * (code.length - 1);
    const state = queue[frame];

    p5.fill(100, 150, 235);
    p5.rect(19 + p5.textWidth(' ') * (state.left - 1), (p5.height - h) / 2 + (state.line - 1) * (p5.textSize() + 2) - 1, (state.right - state.left + 1) * p5.textWidth(' ') + 2, p5.textSize() + 2, 2);

    p5.fill(250);
    for (let i = 0; i < code.length; i++) {
      p5.text(code[i], 20, (p5.height - h) / 2 + i * (p5.textSize() + 2) + p5.textSize() / 2);
    }

    p5.textAlign(p5.LEFT, p5.TOP);
    p5.textSize(16);
    let hStack = 0;
    for (let i = 0; i < state.stack.length; i++) {
      const h = state.stack[i].length * (p5.textSize() + 1) - 1 + 20;
      p5.fill(100, 150, 235);
      p5.rect(320, p5.height - 20 - hStack - h, 130, h, 5);
      for (let j = 0; j < state.stack[i].length; j++) {
        if (j === 0) p5.fill(255, 215, 0);
        else p5.fill(250);
        p5.text(state.stack[i][j], 320 + 10, p5.height - 20 - hStack - h + j * (p5.textSize() + 1) + 10);
      }
      hStack += h + 10;
    }
    p5.textAlign(p5.LEFT, p5.CENTER);

    if (++frames === 75) {
      frame++;
      frames = 0;
    }
    if (frame === queue.length) {
      active = false;
    }
  };

  p5.mousePressed = () => {
    if (!active) {
      frame = 0;
      active = true;
      p5.cursor(p5.ARROW);
    }
    else if (paused) {
      p5.loop();
      paused = false;
    }
    else {
      p5.noLoop();
      paused = true;
    }
  };
};
