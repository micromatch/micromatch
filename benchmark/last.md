#1: basename-braces
  micromatch x 28,257 ops/sec ±0.72% (97 runs sampled)
  minimatch x 3,016 ops/sec ±0.70% (96 runs sampled)

#2: basename
  micromatch x 26,498 ops/sec ±1.01% (94 runs sampled)
  minimatch x 4,072 ops/sec ±0.69% (97 runs sampled)

#3: braces-no-glob
  micromatch x 333,735 ops/sec ±0.81% (95 runs sampled)
  minimatch x 27,698 ops/sec ±0.88% (95 runs sampled)

#4: braces
  micromatch x 58,366 ops/sec ±0.84% (98 runs sampled)
  minimatch x 2,781 ops/sec ±0.75% (97 runs sampled)

#5: immediate
  micromatch x 23,495 ops/sec ±0.68% (98 runs sampled)
  minimatch x 3,841 ops/sec ±0.89% (97 runs sampled)

#6: large
  micromatch x 761 ops/sec ±0.78% (96 runs sampled)
  minimatch x 15.94 ops/sec ±1.01% (42 runs sampled)

#7: long
  micromatch x 7,653 ops/sec ±0.74% (99 runs sampled)
  minimatch x 574 ops/sec ±0.64% (94 runs sampled)

#8: mid
  micromatch x 64,422 ops/sec ±0.76% (95 runs sampled)
  minimatch x 1,722 ops/sec ±0.95% (95 runs sampled)

#9: multi-patterns
  micromatch x 22,265 ops/sec ±0.74% (97 runs sampled)
  minimatch x 2,089 ops/sec ±0.72% (96 runs sampled)

#10: no-glob
  micromatch x 1,045,797 ops/sec ±0.78% (94 runs sampled)
  minimatch x 51,875 ops/sec ±0.79% (94 runs sampled)

#11: range
  micromatch x 261,721 ops/sec ±0.69% (95 runs sampled)
  minimatch x 13,824 ops/sec ±0.66% (98 runs sampled)

#12: shallow
  micromatch x 190,469 ops/sec ±0.70% (95 runs sampled)
  minimatch x 20,565 ops/sec ±0.70% (94 runs sampled)

#13: short
  micromatch x 451,798 ops/sec ±0.69% (93 runs sampled)
  minimatch x 50,688 ops/sec ±0.78% (94 runs sampled)
