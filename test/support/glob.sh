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

t a/c/b             a/*/b
t a/.d/b            a/*/b
t a/./b             a/*/b
t a/../b            a/*/b

t ab                ab**
t abcdef            ab**
t abef              ab**
t abcfef            ab**

f ab                ab***ef
t abcdef            ab***ef
t abef              ab***ef
t abcfef            ab***ef

t .bashrc           ?bashrc

f abbc              ab?bc
f abc               ab?bc

t a.a               [a-d]*.[a-b]
t a.b               [a-d]*.[a-b]
t c.a               [a-d]*.[a-b]
t a.a.a             [a-d]*.[a-b]

f a.a               !*.[a-b]
f a.b               !*.[a-b]
f a.a.a             !*.[a-b]
f c.a               !*.[a-b]
f d.a.d             !*.[a-b]
f a.bb              !*.[a-b]
f a.ccc             !*.[a-b]
f c.ccc             !*.[a-b]

f a.a               !*.[a-b]*
f a.b               !*.[a-b]*
f a.a.a             !*.[a-b]*
f c.a               !*.[a-b]*
f d.a.d             !*.[a-b]*
f a.bb              !*.[a-b]*
f a.ccc             !*.[a-b]*
f c.ccc             !*.[a-b]*

f a.a               !*[a-b].[a-b]*
f a.b               !*[a-b].[a-b]*
f a.a.a             !*[a-b].[a-b]*
f c.a               !*[a-b].[a-b]*
f d.a.d             !*[a-b].[a-b]*
f a.bb              !*[a-b].[a-b]*
f a.ccc             !*[a-b].[a-b]*
f c.ccc             !*[a-b].[a-b]*

t abd               [a-y]*[^c]
t abe               [a-y]*[^c]
t bb                [a-y]*[^c]
t bcd               [a-y]*[^c]
t ca                [a-y]*[^c]
t cb                [a-y]*[^c]
t dd                [a-y]*[^c]
t de                [a-y]*[^c]
t bdir/             [a-y]*[^c]

f abd               **/*

a-b.c-d            *-b*c-*

EOT
echo ""
echo "$failed tests failed."
