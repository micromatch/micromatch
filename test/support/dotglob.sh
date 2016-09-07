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

f a/b/.x            **/.x/**
f .x                **/.x/**
f .x/               **/.x/**
f .x/a              **/.x/**
f .x/a/b            **/.x/**
f .x/.x             **/.x/**
f a/.x              **/.x/**

t a/b/.x/c          **/.x/**
t a/b/.x/c/d        **/.x/**
t a/b/.x/c/d/e      **/.x/**
t a/b/.x/           **/.x/**
t a/.x/b            **/.x/**
t a/.x/b/.x/c       **/.x/**

t .bashrc           ?bashrc
t .b/               *.*
t .bar.baz/         *.*
t .bar              *.*
f .bar              !.*.*

t .bar.baz/         .*.*/
t .bar.baz/         .*.*

EOT
echo ""
echo "$failed tests failed."
