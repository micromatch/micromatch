#1: basename-braces
  micromatch x 26,420 ops/sec ±0.89% (91 runs sampled)
  minimatch x 3,507 ops/sec ±0.64% (97 runs sampled)

#2: basename
  micromatch x 25,315 ops/sec ±0.82% (93 runs sampled)
  minimatch x 4,398 ops/sec ±0.86% (94 runs sampled)

#3: braces-no-glob
  micromatch x 341,254 ops/sec ±0.78% (93 runs sampled)
  minimatch x 30,197 ops/sec ±1.12% (91 runs sampled)

#4: braces
  micromatch x 54,649 ops/sec ±0.74% (94 runs sampled)
  minimatch x 3,095 ops/sec ±0.82% (95 runs sampled)

#5: immediate
  micromatch x 16,719 ops/sec ±0.79% (95 runs sampled)
  minimatch x 4,348 ops/sec ±0.86% (96 runs sampled)

#6: large
  micromatch x 721 ops/sec ±0.77% (94 runs sampled)
  minimatch x 17.73 ops/sec ±1.08% (50 runs sampled)

#7: long
  micromatch x 5,051 ops/sec ±0.87% (97 runs sampled)
  minimatch x 628 ops/sec ±0.83% (94 runs sampled)

#8: mid
  micromatch x 51,280 ops/sec ±0.80% (95 runs sampled)
  minimatch x 1,923 ops/sec ±0.84% (95 runs sampled)

#9: multi-patterns
  micromatch x 22,440 ops/sec ±0.97% (94 runs sampled)
  minimatch x 2,481 ops/sec ±1.10% (94 runs sampled)

#10: no-glob
  micromatch x 722,823 ops/sec ±1.30% (87 runs sampled)
  minimatch x 52,967 ops/sec ±1.09% (94 runs sampled)

#11: range
  micromatch x 243,471 ops/sec ±0.79% (94 runs sampled)
  minimatch x 11,736 ops/sec ±0.82% (96 runs sampled)

#12: shallow
  micromatch x 190,874 ops/sec ±0.98% (95 runs sampled)
  minimatch x 21,699 ops/sec ±0.81% (97 runs sampled)

#13: short
  micromatch x 496,393 ops/sec ±3.86% (90 runs sampled)
  minimatch x 53,765 ops/sec ±0.75% (95 runs sampled)
