#1: basename-braces
  micromatch x 26,626 ops/sec ±0.57% (95 runs sampled)
  minimatch x 3,361 ops/sec ±0.67% (99 runs sampled)

#2: basename
  micromatch x 26,049 ops/sec ±1.14% (91 runs sampled)
  minimatch x 4,134 ops/sec ±0.60% (96 runs sampled)

#3: braces-no-glob
  micromatch x 322,189 ops/sec ±0.77% (94 runs sampled)
  minimatch x 29,490 ops/sec ±0.57% (97 runs sampled)

#4: braces
  micromatch x 64,917 ops/sec ±0.65% (98 runs sampled)
  minimatch x 2,723 ops/sec ±0.73% (98 runs sampled)

#5: immediate
  micromatch x 23,532 ops/sec ±0.78% (93 runs sampled)
  minimatch x 4,054 ops/sec ±0.70% (97 runs sampled)

#6: large
  micromatch x 742 ops/sec ±0.52% (97 runs sampled)
  minimatch x 15.53 ops/sec ±1.08% (42 runs sampled)

#7: long
  micromatch x 7,095 ops/sec ±0.78% (94 runs sampled)
  minimatch x 564 ops/sec ±0.74% (91 runs sampled)

#8: mid
  micromatch x 62,594 ops/sec ±0.79% (95 runs sampled)
  minimatch x 1,673 ops/sec ±1.10% (95 runs sampled)

#9: multi-patterns
  micromatch x 22,855 ops/sec ±0.73% (98 runs sampled)
  minimatch x 2,043 ops/sec ±0.62% (98 runs sampled)

#10: no-glob
  micromatch x 793,537 ops/sec ±0.73% (98 runs sampled)
  minimatch x 52,142 ops/sec ±0.66% (96 runs sampled)

#11: range
  micromatch x 264,407 ops/sec ±0.76% (95 runs sampled)
  minimatch x 13,799 ops/sec ±0.70% (97 runs sampled)

#12: shallow
  micromatch x 180,146 ops/sec ±0.74% (98 runs sampled)
  minimatch x 19,810 ops/sec ±0.73% (97 runs sampled)

#13: short
  micromatch x 421,538 ops/sec ±0.74% (94 runs sampled)
  minimatch x 58,293 ops/sec ±0.81% (95 runs sampled)
