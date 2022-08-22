export interface SolverOptions {
  x0: number;
  targetPrecision?: number;
  tangentDelta?: number;
  maxIterations?: number;
  debug?: Boolean;
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
  tangent: number;
}

export class NewtonsMethodSolver {

  /**
   * Default options
   *
   * @private
   */
  private static defaultOptions: SolverOptions = {
    x0: 0,
    targetPrecision: 1 / 10 ** 10,
    tangentDelta: 1 / 10 ** 8,
    maxIterations: 10 ** 3,
    debug: false,
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
    let x = options.x0;

    let y;

    try {
      do {
        if (options.debug) console.log(`Iteration ${ iterations.length }`);

        y = fn(x);

        let tangent = this.derivative(fn, x, options.tangentDelta);

        if (options.debug) console.log(`f(${ x }) = ${ y }`);
        if (options.debug) console.log(`tangent = ${ tangent }`);

        x = x - y / tangent;

        iterations.push({ x, y, tangent });

        if (isNaN(y) || typeof y === 'undefined') {
          return {
            status: SolverStatus.Error,
            error: new Error(`NaN or undefined with x = ${ x }`),
            iterations,
          };
        }

        // Exact match
        if (y === 0) {
          return {
            status: SolverStatus.ExactSolutionFound,
            result: x,
            iterations,
          };
        }

        // Solution within precision
        if (Math.abs(y) < options.targetPrecision) {
          return {
            status: SolverStatus.SolutionWithinPrecision,
            result: x,
            iterations,
          };
        }

        // Tangent is 0, extremum found
        if (tangent === 0) {
          return {
            status: SolverStatus.ExtremumFound,
            iterations,
          };
        }

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
   * @param value {number}
   * @param delta {number}
   * @private
   */
  private static derivative(
    fn: Function,
    value: number,
    delta: number = 0.001,
  ): number {
    return (
      fn(value + delta) - fn(value)
    ) / delta;
  }

}
