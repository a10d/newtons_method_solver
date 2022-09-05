export interface SolverOptions {
  x0: number;
  targetPrecision?: number;
  slopeDelta?: number;
  maxIterations?: number;
}

export enum SolverStatus {
  ExactSolutionFound,
  SolutionWithinPrecision,
  MaxIterationsExceeded,
  ExtremumFound,
  Error,
}

export interface SolverResult {
  result?: number;
  status: SolverStatus;
  iterations?: SolverIteration[];
  error?: Error;
}

export interface SolverIteration {
  x: number;
  y: number;
  slope: number;
}

export class NewtonsMethodSolver {

  /**
   * Default options
   *
   * @private
   */
  private static defaultOptions: SolverOptions = {
    x0: 0,
    targetPrecision: 10 ** -10,
    slopeDelta: 10 ** -8,
    maxIterations: 10 ** 3,
  };

  /**
   * Solves the equation f(x) = 0 using the Newton's method
   * @param fn {Function} The function f(x) to be solved
   * @param options {SolverOptions} Configurable options for the solver
   */
  static solve(
    fn: Function,
    options: SolverOptions,
  ): SolverResult {

    options = {
      ...this.defaultOptions,
      ...options,
    };

    let iterations: SolverIteration[] = [];
    let x: number = options.x0;

    let y: number;
    let slope: number;

    try {
      do {
        y = fn(x);
        slope = this.slope(fn, x, options.slopeDelta);

        iterations.push({ x, y, slope });

        // Result is undefined or NaN
        if (isNaN(y) || typeof y === 'undefined') return {
          status: SolverStatus.Error,
          error: new Error(`NaN or undefined with x = ${ x }`),
          iterations,
        };

        // Exact match
        if (y === 0) return {
          status: SolverStatus.ExactSolutionFound,
          result: x,
          iterations,
        };

        // Solution within precision
        if (Math.abs(y) < options.targetPrecision) return {
          status: SolverStatus.SolutionWithinPrecision,
          result: x,
          iterations,
        };

        // Slope is 0, extremum found
        if (slope === 0) return {
          status: SolverStatus.ExtremumFound,
          iterations,
        };

        x = x - y / slope;

      } while (iterations.length < options.maxIterations);

    } catch (error) {
      return {
        status: SolverStatus.Error,
        error,
      };
    }

    return {
      status: SolverStatus.MaxIterationsExceeded,
      result: x,
      iterations,
    };
  }

  /**
   *
   * @param fn {Function} The function f(x) to solve for.
   * @param value {number} The current value of x.
   * @param delta {number} The delta to use when calculating the slope.
   * @private
   */
  private static slope(
    fn: Function,
    value: number,
    delta: number,
  ): number {
    return (fn(value + delta) - fn(value)) / delta;
  }

}
