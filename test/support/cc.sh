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

t /      [^c]
f r/     [^c]

t 01234       [[:digit:]e]*
t 0123e456    [[:digit:]e]*
t 0123e45g78  [[:digit:]e]*

t a  [:alpha:]
t a  [[:alpha:]]
t A  [[:alpha:]]
t A  [[:upper:]]
f A  [[:lower:]]
f a7  [[:lower:][:lower:]]
t a7  [[:lower:][:digit:]]*

EOT
echo ""
echo "$failed tests failed."
