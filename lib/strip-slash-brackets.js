'use strict';

/**
 * Remove slash characters from bracket expressions in a glob pattern.
 *
 * According to POSIX, a slash character inside a bracket expression
 * (e.g. `[/]`) should not match a path separator. This function strips
 * slashes from bracket expressions so they produce the correct behavior.
 *
 * If a non-negated bracket expression becomes empty after removing slashes
 * (e.g. `[/]`), it is replaced with a character class that can never match
 * (`[^\s\S]`), causing the entire pattern to fail to match any string.
 *
 * For negated brackets like `[^/]`, the slash is kept since picomatch
 * already handles it correctly (matching any character except `/`).
 *
 * @param {String} pattern - glob pattern
 * @return {String} pattern with slashes removed from bracket expressions
 */

module.exports = pattern => {
  if (typeof pattern !== 'string') return pattern;

  let result = '';
  let i = 0;

  while (i < pattern.length) {
    // handle backslash escapes outside brackets
    if (pattern[i] === '\\') {
      result += pattern[i] + (pattern[i + 1] || '');
      i += 2;
      continue;
    }

    if (pattern[i] === '[') {
      let bracketStart = i;
      let inner = '';
      i++; // skip opening '['

      // handle negation (^ or !)
      let negation = '';
      if (i < pattern.length && (pattern[i] === '^' || pattern[i] === '!')) {
        negation = pattern[i];
        i++;
      }

      // handle literal ']' at the start of a bracket expression
      if (i < pattern.length && pattern[i] === ']') {
        inner += pattern[i];
        i++;
      }

      // collect the rest of the bracket contents
      while (i < pattern.length && pattern[i] !== ']') {
        if (pattern[i] === '\\') {
          inner += pattern[i] + (pattern[i + 1] || '');
          i += 2;
          continue;
        }
        inner += pattern[i];
        i++;
      }

      if (i >= pattern.length) {
        // no closing bracket found, treat as literal
        result += pattern.slice(bracketStart);
        break;
      }

      // i is now at the closing ']'
      i++; // skip closing ']'

      // strip forward slashes from the bracket contents
      let stripped = inner.replace(/\//g, '');

      if (negation !== '' && stripped.length === 0) {
        // negated bracket with only slash, e.g. [^/]
        // picomatch already handles this correctly, keep as-is
        result += '[' + negation + inner + ']';
      } else if (stripped.length === 0) {
        // non-negated bracket like [/] becomes empty — can never match
        result += '[^\\s\\S]';
      } else {
        result += '[' + negation + stripped + ']';
      }

      continue;
    }

    result += pattern[i];
    i++;
  }

  return result;
};
