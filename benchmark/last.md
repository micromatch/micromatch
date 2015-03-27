#1: basename-braces
  micromatch x 27,734 ops/sec ±0.75% (93 runs sampled)
  minimatch x 3,409 ops/sec ±0.77% (97 runs sampled)

#2: basename
  micromatch x 26,727 ops/sec ±0.81% (97 runs sampled)
  minimatch x 4,122 ops/sec ±0.77% (97 runs sampled)

#3: braces-no-glob
  micromatch x 324,367 ops/sec ±0.62% (95 runs sampled)
  minimatch x 29,682 ops/sec ±0.71% (94 runs sampled)

#4: braces
  micromatch x 63,430 ops/sec ±1.14% (95 runs sampled)
  minimatch x 2,749 ops/sec ±0.77% (97 runs sampled)

#5: immediate
  micromatch x 21,842 ops/sec ±0.66% (98 runs sampled)
  minimatch x 3,638 ops/sec ±0.66% (97 runs sampled)

#6: large
  micromatch x 802 ops/sec ±0.58% (96 runs sampled)
  minimatch x 15.72 ops/sec ±1.25% (42 runs sampled)

#7: long
  micromatch x 8,061 ops/sec ±0.69% (96 runs sampled)
  minimatch x 560 ops/sec ±0.71% (90 runs sampled)

#8: mid
  micromatch x 67,972 ops/sec ±0.78% (93 runs sampled)
  minimatch x 1,745 ops/sec ±0.87% (96 runs sampled)

#9: multi-patterns
  micromatch x 25,136 ops/sec ±0.87% (95 runs sampled)
  minimatch x 1,986 ops/sec ±1.03% (95 runs sampled)

#10: no-glob
  micromatch x 1,062,274 ops/sec ±0.90% (94 runs sampled)
  minimatch x 53,150 ops/sec ±0.85% (96 runs sampled)

#11: range
  micromatch x 270,918 ops/sec ±0.75% (97 runs sampled)
  minimatch x 13,548 ops/sec ±0.85% (96 runs sampled)

#12: shallow
  micromatch x 198,022 ops/sec ±0.80% (97 runs sampled)
  minimatch x 20,093 ops/sec ±0.62% (95 runs sampled)

#13: short
  micromatch x 440,230 ops/sec ±0.84% (97 runs sampled)
  minimatch x 58,116 ops/sec ±0.74% (92 runs sampled)
