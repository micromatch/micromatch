var actual = fn("!**/a/*/b/c/.js");
actual.should.eql(/^(?!^(?:(?:(?!(?:\/|^)\.).)*?\/a\/(?!\.)(?=.)[^/]*?\/b\/c\/\.js)$).*$/);

var actual = fn("!**/a/*/b/c.d/.js");
actual.should.eql(/^(?!^(?:(?:(?!(?:\/|^)\.).)*?\/a\/(?!\.)(?=.)[^/]*?\/b\/c\.d\/\.js)$).*$/);

var actual = fn("!**/*.{*,gitignore}");
actual.should.eql(/^(?!^(?:(?:(?!(?:\/|^)\.).)*?\/(?!\.)(?=.)[^/]*?\.((?!\.)(?=.)[^/]*?|gitignore))$).*$/);

var actual = fn("!**/*.{js,gitignore}");
actual.should.eql(/^(?!^(?:(?:(?!(?:\/|^)\.).)*?\/(?!\.)(?=.)[^/]*?\.(js|gitignore))$).*$/);

var actual = fn("!**/{a,/.gitignore}");
actual.should.eql(/^(?!^(?:(?:(?!(?:\/|^)\.).)*?\/(a|\/\.gitignore))$).*$/);

var actual = fn("!**/{a..z..2}/*.js");
actual.should.eql(/^(?!^(?:(?:(?!(?:\/|^)\.).)*?\/(a|c|e|g|i|k|m|o|q|s|u|w|y)\/(?!\.)(?=.)[^/]*?\.js)$).*$/);

var actual = fn("!**/{a..c}/*.js");
actual.should.eql(/^(?!^(?:(?:(?!(?:\/|^)\.).)*?\/(?!\.)(?=.)[a-c]\/(?!\.)(?=.)[^/]*?\.js)$).*$/);

var actual = fn("!**/{1..10}/*.js");
actual.should.eql(/^(?!^(?:(?:(?!(?:\/|^)\.).)*?\/(?!\.)(?=.)[1-10]\/(?!\.)(?=.)[^/]*?\.js)$).*$/);

var actual = fn("!**/{1..10..2}/*.js");
actual.should.eql(/^(?!^(?:(?:(?!(?:\/|^)\.).)*?\/(1|3|5|7|9)\/(?!\.)(?=.)[^/]*?\.js)$).*$/);

var actual = fn("!a/{b..s}/xyz/*-{01..10}.js");
actual.should.eql(/^(?!^(?:a\/(?!\.)(?=.)[b-s]\/xyz\/(?!\.)(?=.)[^/]*?-(?!\.)(?=.)[01-10]\.js)$).*$/);

var actual = fn("!a");
actual.should.eql(/^(?!^(?:a)$).*$/);

var actual = fn("!a/");
actual.should.eql(/^(?!^(?:a\/)$).*$/);

var actual = fn("!a/*");
actual.should.eql(/^(?!^(?:a\/(?!\.)(?=.)[^/]*?)$).*$/);

var actual = fn("!.*");
actual.should.eql(/^(?!^(?:(?=.)\.[^/]*?)$).*$/);

var actual = fn("!**/**/.*");
actual.should.eql(/^(?!^(?:(?:(?!(?:\/|^)\.).)*?\/(?:(?!(?:\/|^)\.).)*?\/(?=.)\.[^/]*?)$).*$/);

var actual = fn("!**/**/.*");
actual.should.eql(/^(?!^(?:(?:(?!(?:\/|^)\.).)*?\/(?:(?!(?:\/|^)\.).)*?\/(?=.)\.[^/]*?)$).*$/);

var actual = fn("!**/.*/.*");
actual.should.eql(/^(?!^(?:(?:(?!(?:\/|^)\.).)*?\/(?=.)\.[^/]*?\/(?=.)\.[^/]*?)$).*$/);

var actual = fn("!**/.*");
actual.should.eql(/^(?!^(?:(?:(?!(?:\/|^)\.).)*?\/(?=.)\.[^/]*?)$).*$/);

var actual = fn("!**/*.*");
actual.should.eql(/^(?!^(?:(?:(?!(?:\/|^)\.).)*?\/(?!\.)(?=.)[^/]*?\.[^/]*?)$).*$/);

var actual = fn("!**/*.");
actual.should.eql(/^(?!^(?:(?:(?!(?:\/|^)\.).)*?\/(?!\.)(?=.)[^/]*?\.)$).*$/);

var actual = fn("!**/*.a");
actual.should.eql(/^(?!^(?:(?:(?!(?:\/|^)\.).)*?\/(?!\.)(?=.)[^/]*?\.a)$).*$/);

var actual = fn("!**/*.js");
actual.should.eql(/^(?!^(?:(?:(?!(?:\/|^)\.).)*?\/(?!\.)(?=.)[^/]*?\.js)$).*$/);

var actual = fn("!**/*.md");
actual.should.eql(/^(?!^(?:(?:(?!(?:\/|^)\.).)*?\/(?!\.)(?=.)[^/]*?\.md)$).*$/);

var actual = fn("!**/.*");
actual.should.eql(/^(?!^(?:(?:(?!(?:\/|^)\.).)*?\/(?=.)\.[^/]*?)$).*$/);

var actual = fn("!**/.*.js");
actual.should.eql(/^(?!^(?:(?:(?!(?:\/|^)\.).)*?\/(?=.)\.[^/]*?\.js)$).*$/);

var actual = fn("!**/.*.md");
actual.should.eql(/^(?!^(?:(?:(?!(?:\/|^)\.).)*?\/(?=.)\.[^/]*?\.md)$).*$/);

var actual = fn("!**/.a");
actual.should.eql(/^(?!^(?:(?:(?!(?:\/|^)\.).)*?\/\.a)$).*$/);

var actual = fn("!**/.a.js");
actual.should.eql(/^(?!^(?:(?:(?!(?:\/|^)\.).)*?\/\.a\.js)$).*$/);

var actual = fn("!**/.gitignore");
actual.should.eql(/^(?!^(?:(?:(?!(?:\/|^)\.).)*?\/\.gitignore)$).*$/);

var actual = fn("!*.*");
actual.should.eql(/^(?!^(?:(?!\.)(?=.)[^/]*?\.[^/]*?)$).*$/);

var actual = fn("!*.a");
actual.should.eql(/^(?!^(?:(?!\.)(?=.)[^/]*?\.a)$).*$/);

var actual = fn("!*.gitignore");
actual.should.eql(/^(?!^(?:(?!\.)(?=.)[^/]*?\.gitignore)$).*$/);

var actual = fn("!*.{gitignore,*}");
actual.should.eql(/^(?!^(?:(?!\.)(?=.)[^/]*?\.(gitignore|(?!\.)(?=.)[^/]*?))$).*$/);

var actual = fn("!*.{*,gitignore,js}");
actual.should.eql(/^(?!^(?:(?!\.)(?=.)[^/]*?\.((?!\.)(?=.)[^/]*?|gitignore|js))$).*$/);

var actual = fn("!*.{*,gitignore}");
actual.should.eql(/^(?!^(?:(?!\.)(?=.)[^/]*?\.((?!\.)(?=.)[^/]*?|gitignore))$).*$/);

var actual = fn("!.{*,gitignore}");
actual.should.eql(/^(?!^(?:.((?!\.)(?=.)[^/]*?|gitignore))$).*$/);

var actual = fn("!**/.{*,gitignore}");
actual.should.eql(/^(?!^(?:(?:(?!(?:\/|^)\.).)*?\/.((?!\.)(?=.)[^/]*?|gitignore))$).*$/);

var actual = fn("!**/.{js,gitignore}");
actual.should.eql(/^(?!^(?:(?:(?!(?:\/|^)\.).)*?\/.(js|gitignore))$).*$/);

var actual = fn("!**/.{js,md}");
actual.should.eql(/^(?!^(?:(?:(?!(?:\/|^)\.).)*?\/.(js|md))$).*$/);

var actual = fn("!**/*.{js,md}");
actual.should.eql(/^(?!^(?:(?:(?!(?:\/|^)\.).)*?\/(?!\.)(?=.)[^/]*?\.(js|md))$).*$/);

var actual = fn("!**/(a|b)/*.{js,md}");
actual.should.eql(/^(?!^(?:(?:(?!(?:\/|^)\.).)*?\/(a|b)\/(?!\.)(?=.)[^/]*?\.(js|md))$).*$/);

var actual = fn("!**/[a-z]/*.{js,md}");
actual.should.eql(/^(?!^(?:(?:(?!(?:\/|^)\.).)*?\/(?!\.)(?=.)[a-z]\/(?!\.)(?=.)[^/]*?\.(js|md))$).*$/);

var actual = fn("!*.js");
actual.should.eql(/^(?!^(?:(?!\.)(?=.)[^/]*?\.js)$).*$/);

var actual = fn("!*.md");
actual.should.eql(/^(?!^(?:(?!\.)(?=.)[^/]*?\.md)$).*$/);

var actual = fn("!*.{js,txt}");
actual.should.eql(/^(?!^(?:(?!\.)(?=.)[^/]*?\.(js|txt))$).*$/);

var actual = fn("!*/*.gitignore");
actual.should.eql(/^(?!^(?:(?!\.)(?=.)[^/]*?\/(?!\.)(?=.)[^/]*?\.gitignore)$).*$/);

var actual = fn("!*/.gitignore");
actual.should.eql(/^(?!^(?:(?!\.)(?=.)[^/]*?\/\.gitignore)$).*$/);

var actual = fn("!.a");
actual.should.eql(/^(?!^(?:\.a)$).*$/);

var actual = fn("!.gitignore");
actual.should.eql(/^(?!^(?:\.gitignore)$).*$/);

var actual = fn("!.js");
actual.should.eql(/^(?!^(?:\.js)$).*$/);

var actual = fn("!.md");
actual.should.eql(/^(?!^(?:\.md)$).*$/);

var actual = fn("!a/**/c/*.js");
actual.should.eql(/^(?!^(?:a\/(?:(?!(?:\/|^)\.).)*?\/c\/(?!\.)(?=.)[^/]*?\.js)$).*$/);

var actual = fn("!a/**/c/*.md");
actual.should.eql(/^(?!^(?:a\/(?:(?!(?:\/|^)\.).)*?\/c\/(?!\.)(?=.)[^/]*?\.md)$).*$/);

var actual = fn("!a/**/j/**/z/*.js");
actual.should.eql(/^(?!^(?:a\/(?:(?!(?:\/|^)\.).)*?\/j\/(?:(?!(?:\/|^)\.).)*?\/z\/(?!\.)(?=.)[^/]*?\.js)$).*$/);

var actual = fn("!a/**/j/**/z/*.md");
actual.should.eql(/^(?!^(?:a\/(?:(?!(?:\/|^)\.).)*?\/j\/(?:(?!(?:\/|^)\.).)*?\/z\/(?!\.)(?=.)[^/]*?\.md)$).*$/);

var actual = fn("!a/**/z/*.js");
actual.should.eql(/^(?!^(?:a\/(?:(?!(?:\/|^)\.).)*?\/z\/(?!\.)(?=.)[^/]*?\.js)$).*$/);

var actual = fn("!a/**/z/*.md");
actual.should.eql(/^(?!^(?:a\/(?:(?!(?:\/|^)\.).)*?\/z\/(?!\.)(?=.)[^/]*?\.md)$).*$/);

var actual = fn("!a/*.js");
actual.should.eql(/^(?!^(?:a\/(?!\.)(?=.)[^/]*?\.js)$).*$/);

var actual = fn("!a/*.md");
actual.should.eql(/^(?!^(?:a\/(?!\.)(?=.)[^/]*?\.md)$).*$/);

var actual = fn("!a/*.txt");
actual.should.eql(/^(?!^(?:a\/(?!\.)(?=.)[^/]*?\.txt)$).*$/);

var actual = fn("!a/*/.b");
actual.should.eql(/^(?!^(?:a\/(?!\.)(?=.)[^/]*?\/\.b)$).*$/);

var actual = fn("!a/*/.b.a");
actual.should.eql(/^(?!^(?:a\/(?!\.)(?=.)[^/]*?\/\.b\.a)$).*$/);

var actual = fn("!a/*/?/**/e.js");
actual.should.eql(/^(?!^(?:a\/(?!\.)(?=.)[^/]*?\/(?!\.)(?=.)[^/]\/(?:(?!(?:\/|^)\.).)*?\/e\.js)$).*$/);

var actual = fn("!a/*/?/**/e.md");
actual.should.eql(/^(?!^(?:a\/(?!\.)(?=.)[^/]*?\/(?!\.)(?=.)[^/]\/(?:(?!(?:\/|^)\.).)*?\/e\.md)$).*$/);

var actual = fn("!a/*/b");
actual.should.eql(/^(?!^(?:a\/(?!\.)(?=.)[^/]*?\/b)$).*$/);

var actual = fn("!a/*/c/*.js");
actual.should.eql(/^(?!^(?:a\/(?!\.)(?=.)[^/]*?\/c\/(?!\.)(?=.)[^/]*?\.js)$).*$/);

var actual = fn("!a/*/c/*.md");
actual.should.eql(/^(?!^(?:a\/(?!\.)(?=.)[^/]*?\/c\/(?!\.)(?=.)[^/]*?\.md)$).*$/);

var actual = fn("!a/.*/b");
actual.should.eql(/^(?!^(?:a\/(?=.)\.[^/]*?\/b)$).*$/);

var actual = fn("!a/?/**/e.js");
actual.should.eql(/^(?!^(?:a\/(?!\.)(?=.)[^/]\/(?:(?!(?:\/|^)\.).)*?\/e\.js)$).*$/);

var actual = fn("!a/?/**/e.md");
actual.should.eql(/^(?!^(?:a\/(?!\.)(?=.)[^/]\/(?:(?!(?:\/|^)\.).)*?\/e\.md)$).*$/);

var actual = fn("!a/?/c.js");
actual.should.eql(/^(?!^(?:a\/(?!\.)(?=.)[^/]\/c\.js)$).*$/);

var actual = fn("!a/?/c.md");
actual.should.eql(/^(?!^(?:a\/(?!\.)(?=.)[^/]\/c\.md)$).*$/);

var actual = fn("!a/?/c/?/*/e.js");
actual.should.eql(/^(?!^(?:a\/(?!\.)(?=.)[^/]\/c\/(?!\.)(?=.)[^/]\/(?!\.)(?=.)[^/]*?\/e\.js)$).*$/);

var actual = fn("!a/?/c/?/*/e.md");
actual.should.eql(/^(?!^(?:a\/(?!\.)(?=.)[^/]\/c\/(?!\.)(?=.)[^/]\/(?!\.)(?=.)[^/]*?\/e\.md)$).*$/);

var actual = fn("!a/?/c/?/e.js");
actual.should.eql(/^(?!^(?:a\/(?!\.)(?=.)[^/]\/c\/(?!\.)(?=.)[^/]\/e\.js)$).*$/);

var actual = fn("!a/?/c/?/e.md");
actual.should.eql(/^(?!^(?:a\/(?!\.)(?=.)[^/]\/c\/(?!\.)(?=.)[^/]\/e\.md)$).*$/);

var actual = fn("!a/?/c/???/e.js");
actual.should.eql(/^(?!^(?:a\/(?!\.)(?=.)[^/]\/c\/(?!\.)(?=.)[^/]..\/e\.js)$).*$/);

var actual = fn("!a/?/c/???/e.md");
actual.should.eql(/^(?!^(?:a\/(?!\.)(?=.)[^/]\/c\/(?!\.)(?=.)[^/]..\/e\.md)$).*$/);

var actual = fn("!a/??/c.js");
actual.should.eql(/^(?!^(?:a\/(?!\.)(?=.)[^/].\/c\.js)$).*$/);

var actual = fn("!a/??/c.md");
actual.should.eql(/^(?!^(?:a\/(?!\.)(?=.)[^/].\/c\.md)$).*$/);

var actual = fn("!a/???/c.js");
actual.should.eql(/^(?!^(?:a\/(?!\.)(?=.)[^/]..\/c\.js)$).*$/);

var actual = fn("!a/???/c.md");
actual.should.eql(/^(?!^(?:a\/(?!\.)(?=.)[^/]..\/c\.md)$).*$/);

var actual = fn("!a/????/c.js");
actual.should.eql(/^(?!^(?:a\/(?!\.)(?=.)[^/]...\/c\.js)$).*$/);

var actual = fn("!a/????/c.md");
actual.should.eql(/^(?!^(?:a\/(?!\.)(?=.)[^/]...\/c\.md)$).*$/);

var actual = fn("!a/b/**/c{d,e}/**/xyz.js");
actual.should.eql(/^(?!^(?:a\/b\/(?:(?!(?:\/|^)\.).)*?\/c(d|e)\/(?:(?!(?:\/|^)\.).)*?\/xyz\.js)$).*$/);

var actual = fn("!a/b/**/c{d,e}/**/xyz.md");
actual.should.eql(/^(?!^(?:a\/b\/(?:(?!(?:\/|^)\.).)*?\/c(d|e)\/(?:(?!(?:\/|^)\.).)*?\/xyz\.md)$).*$/);

var actual = fn("!a/b/c/*.js");
actual.should.eql(/^(?!^(?:a\/b\/c\/(?!\.)(?=.)[^/]*?\.js)$).*$/);

var actual = fn("!A/b/C/*.js");
actual.should.eql(/^(?!^(?:A\/b\/C\/(?!\.)(?=.)[^/]*?\.js)$).*$/);

var actual = fn("!a/b/c/*.md");
actual.should.eql(/^(?!^(?:a\/b\/c\/(?!\.)(?=.)[^/]*?\.md)$).*$/);

var actual = fn("!A/b/C/*.md");
actual.should.eql(/^(?!^(?:A\/b\/C\/(?!\.)(?=.)[^/]*?\.md)$).*$/);

var actual = fn("!A/b/C/*.MD");
actual.should.eql(/^(?!^(?:A\/b\/C\/(?!\.)(?=.)[^/]*?\.MD)$).*$/);

var actual = fn("!a/b/c{d,e{f,g}}/*.js");
actual.should.eql(/^(?!^(?:a\/b\/cd\/(?!\.)(?=.)[^/]*?\.js|a\/b\/ce(f|g)\/(?!\.)(?=.)[^/]*?\.js)$).*$/);

var actual = fn("!a/b/c{d,e{f,g}}/*.md");
actual.should.eql(/^(?!^(?:a\/b\/cd\/(?!\.)(?=.)[^/]*?\.md|a\/b\/ce(f|g)\/(?!\.)(?=.)[^/]*?\.md)$).*$/);

var actual = fn("!a/b/c{d,e}/*.js");
actual.should.eql(/^(?!^(?:a\/b\/c(d|e)\/(?!\.)(?=.)[^/]*?\.js)$).*$/);

var actual = fn("!a/b/c{d,e}/*.md");
actual.should.eql(/^(?!^(?:a\/b\/c(d|e)\/(?!\.)(?=.)[^/]*?\.md)$).*$/);

var actual = fn("!a/b/c{d,e}/xyz.js");
actual.should.eql(/^(?!^(?:a\/b\/c(d|e)\/xyz\.js)$).*$/);

var actual = fn("!a/b/c{d,e}/xyz.md");
actual.should.eql(/^(?!^(?:a\/b\/c(d|e)\/xyz\.md)$).*$/);

var actual = fn("!a/{c..e}.js");
actual.should.eql(/^(?!^(?:a\/(?!\.)(?=.)[c-e]\.js)$).*$/);

var actual = fn("!E:**/*.js");
actual.should.eql(/^(?!^(?:(?=.)E:[^/]*?[^/]*?\/(?!\.)(?=.)[^/]*?\.js)$).*$/);

var actual = fn("!E:**/*.md");
actual.should.eql(/^(?!^(?:(?=.)E:[^/]*?[^/]*?\/(?!\.)(?=.)[^/]*?\.md)$).*$/);

var actual = fn("!E:\\**/*.js");
actual.should.eql(/^(?!^(?:(?=.)E:\\[^/]*?[^/]*?\/(?!\.)(?=.)[^/]*?\.js)$).*$/);

var actual = fn("!E:\\**/*.md");
actual.should.eql(/^(?!^(?:(?=.)E:\\[^/]*?[^/]*?\/(?!\.)(?=.)[^/]*?\.md)$).*$/);
