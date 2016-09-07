#
# More ksh-like extended globbing tests, cribbed from zsh-3.1.5
#
shopt -s extglob

failed=0
while read res str pat; do
  [[ $res = '#' ]] && continue
  [[ $str = ${pat} ]]
  ts=$?
  [[ $1 = -q ]] || echo "$ts:  [[ $str = $pat ]]"
  if [[ ( $ts -gt 0 && $res = t) || ($ts -eq 0 && $res = f) ]]; then
    echo "Test failed:  [[ $str = $pat ]]"
    (( failed += 1 ))
  fi
done <<EOT

f a/b.js   !**/*.md
f a.js     !**/*.md
f a/b.md   !**/*.md
f a.md     !**/*.md

f a/b.js    !*.md
f a.js      !*.md
f a/b.md    !*.md
f a.md      !*.md

f a.js      !**/*.md
f b.md      !**/*.md
f c.txt     !**/*.md

EOT
echo ""
echo "$failed tests failed."
