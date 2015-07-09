#1: basename-braces
  micromatch x 28,335 ops/sec ±0.49% (96 runs sampled)
  minimatch x 3,496 ops/sec ±0.76% (98 runs sampled)

#2: basename
  micromatch x 28,602 ops/sec ±0.46% (96 runs sampled)
  minimatch x 4,389 ops/sec ±0.38% (98 runs sampled)

#3: braces-no-glob
  micromatch x 405,445 ops/sec ±0.64% (91 runs sampled)
  minimatch x 31,078 ops/sec ±0.45% (95 runs sampled)

#4: braces
  micromatch x 81,977 ops/sec ±0.36% (99 runs sampled)
  minimatch x 2,986 ops/sec ±0.41% (100 runs sampled)

#5: immediate
  micromatch x 20,753 ops/sec ±0.36% (101 runs sampled)
  minimatch x 4,233 ops/sec ±0.34% (100 runs sampled)

#6: large
  micromatch x 755 ops/sec ±0.53% (97 runs sampled)
  minimatch x 17.06 ops/sec ±0.25% (46 runs sampled)

#7: long
  micromatch x 7,009 ops/sec ±0.33% (100 runs sampled)
  minimatch x 592 ops/sec ±0.39% (96 runs sampled)

#8: mid
  micromatch x 60,071 ops/sec ±0.48% (97 runs sampled)
  minimatch x 1,853 ops/sec ±0.72% (99 runs sampled)

#9: multi-patterns
  micromatch x 24,308 ops/sec ±0.67% (98 runs sampled)
  minimatch x 2,169 ops/sec ±0.62% (96 runs sampled)

#10: no-glob
  micromatch x 552,116 ops/sec ±0.35% (96 runs sampled)
  minimatch x 55,957 ops/sec ±0.32% (94 runs sampled)

#11: range
  micromatch x 321,030 ops/sec ±0.62% (95 runs sampled)
  minimatch x 14,247 ops/sec ±0.59% (100 runs sampled)

#12: shallow
  micromatch x 253,455 ops/sec ±0.52% (99 runs sampled)
  minimatch x 21,169 ops/sec ±0.54% (97 runs sampled)

#13: short
  micromatch x 661,874 ops/sec ±0.42% (96 runs sampled)
  minimatch x 60,228 ops/sec ±0.45% (97 runs sampled)
