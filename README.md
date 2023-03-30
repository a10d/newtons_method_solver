# Newton's Method Solver

[Live demo](https://schmied.dev/static/newtons_method_solver/)

This algorithm can be used to approximate a zero point for a given non-linear mathematical function <i>f(x)</i> from a given start point <i>x<sub>0</sub></i>.

## Usage


```ts
NewtonsMethodSolver.solve(fx, options)
```

Where the default options are:

```ts
{
    x0: 0,
    targetPrecision: 10 ** -10,
    slopeDelta: 10 ** -8,
    maxIterations: 10 ** 3,
}    
```
