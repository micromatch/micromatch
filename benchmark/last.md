#1: basename-braces
  micromatch x 28,631 ops/sec ±0.87% (95 runs sampled)
  minimatch x 3,342 ops/sec ±0.66% (99 runs sampled)

#2: basename
  micromatch x 29,048 ops/sec ±0.57% (94 runs sampled)
  minimatch x 4,066 ops/sec ±0.65% (98 runs sampled)

#3: braces-no-glob
  micromatch x 392,536 ops/sec ±0.78% (94 runs sampled)
  minimatch x 27,715 ops/sec ±0.55% (92 runs sampled)

#4: braces
  micromatch x 78,032 ops/sec ±0.49% (97 runs sampled)
  minimatch x 2,733 ops/sec ±0.57% (98 runs sampled)

#5: immediate
  micromatch x 22,808 ops/sec ±0.68% (95 runs sampled)
  minimatch x 3,997 ops/sec ±0.53% (96 runs sampled)

#6: large
  micromatch x 795 ops/sec ±0.73% (95 runs sampled)
  minimatch x 15.78 ops/sec ±1.30% (43 runs sampled)

#7: long
  micromatch x 6,471 ops/sec ±0.58% (94 runs sampled)
  minimatch x 549 ops/sec ±0.67% (93 runs sampled)

#8: mid
  micromatch x 57,209 ops/sec ±0.56% (100 runs sampled)
  minimatch x 1,569 ops/sec ±0.63% (97 runs sampled)

#9: multi-patterns
  micromatch x 24,622 ops/sec ±0.67% (94 runs sampled)
  minimatch x 2,148 ops/sec ±0.95% (94 runs sampled)

#10: no-glob
  micromatch x 552,083 ops/sec ±0.62% (94 runs sampled)
  minimatch x 54,492 ops/sec ±0.57% (98 runs sampled)

#11: range
  micromatch x 307,461 ops/sec ±0.69% (95 runs sampled)
  minimatch x 13,807 ops/sec ±0.65% (96 runs sampled)

#12: shallow
  micromatch x 238,743 ops/sec ±0.65% (94 runs sampled)
  minimatch x 18,767 ops/sec ±0.56% (98 runs sampled)

#13: short
  micromatch x 590,975 ops/sec ±0.56% (96 runs sampled)
  minimatch x 56,849 ops/sec ±0.77% (94 runs sampled)
