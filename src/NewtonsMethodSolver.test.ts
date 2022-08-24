const { parse } = require('mathjs');
const { NewtonsMethodSolver } = require('./NewtonsMethodSolver');

for (const { fn, tests } of [
  {
    fn: 'f(x) = sin(x)^2 - sqrt(x) + x^3 - 12',
    tests: [
      { x0: 2, zeroPoint: 2.35320 },
      { x0: 3, zeroPoint: 2.35320 },
      { x0: 1, zeroPoint: 2.35320 },
    ],
  },
  {
    fn: 'g(x) = x^PI + sqrt(2)/x - 3^x - 2',
    tests: [
      { x0: 0.1, zeroPoint: 0.40398 },
      { x0: 0.5, zeroPoint: 0.40398 },
      { x0: 2, zeroPoint: 2.34405 },
      { x0: 3, zeroPoint: 2.34405 },
      { x0: 4, zeroPoint: 3.77775 },
    ],
  },
  {
    fn: 'h(x) = (x^2+2)/(x^3-2x+4)-(e^(2x)-x^(1/3))/(4x-8x^2)-4',
    tests: [
      // Skip the not real numbers
      //{ x0: -1.8, zeroPoint: -1.85004 },
      //{ x0: -0.2, zeroPoint: -0.07877 },
      { x0: 0.7, zeroPoint: 0.67389 },
      { x0: 3, zeroPoint: 2.43322 },
    ],
  },
  {
    fn: 'j(x) = cos(2x)+cos(x^2)/2+PI^x-4',
    tests: [
      { x0: -2, zeroPoint: 1.44196 },
      { x0: 0, zeroPoint: 1.44196 },
      { x0: 1, zeroPoint: 1.44196 },
      { x0: 2, zeroPoint: 1.44196 },
    ],
  },
]) {

  const fx = parse(fn).evaluate();

  for (const { x0, zeroPoint } of tests) {

    test(`${ fn }${ ' '.repeat(54 - fn.length) } | x0 = ${ x0 }${ ' '.repeat( 3 - x0.toString().length)} | 0 at ~ ${zeroPoint} |`, () => {
      const maxIterations = 100;

      const evaluation = NewtonsMethodSolver.solve(fx, { x0, maxIterations });

      expect(evaluation).not.toHaveProperty('error');
      expect(evaluation.result).toBeCloseTo(zeroPoint, 5);

      expect(evaluation.result).not.toBeNaN();
      expect(evaluation.result).not.toBeUndefined();

      expect(evaluation.iterations.length).toBeLessThanOrEqual(maxIterations);
    });
  }

}
