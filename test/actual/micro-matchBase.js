var actual = fn("**/*.{*,gitignore}");
actual.should.eql(/^(?:(?:(?!(?:\/|^)\.).)*?\/(?!\.)(?=.)[^/]*?\.[^/]*?|(?:(?!(?:\/|^)\.).)*?\/(?!\.)(?=.)[^/]*?\.gitignore)$/);

var actual = fn("**/*.{js,gitignore}");
actual.should.eql(/^(?:(?:(?!(?:\/|^)\.).)*?\/(?!\.)(?=.)[^/]*?\.js|(?:(?!(?:\/|^)\.).)*?\/(?!\.)(?=.)[^/]*?\.gitignore)$/);

var actual = fn("**/{a..z..2}/*.js");
actual.should.eql(/^(?:(?:(?!(?:\/|^)\.).)*?\/a\/(?!\.)(?=.)[^/]*?\.js|(?:(?!(?:\/|^)\.).)*?\/c\/(?!\.)(?=.)[^/]*?\.js|(?:(?!(?:\/|^)\.).)*?\/e\/(?!\.)(?=.)[^/]*?\.js|(?:(?!(?:\/|^)\.).)*?\/g\/(?!\.)(?=.)[^/]*?\.js|(?:(?!(?:\/|^)\.).)*?\/i\/(?!\.)(?=.)[^/]*?\.js|(?:(?!(?:\/|^)\.).)*?\/k\/(?!\.)(?=.)[^/]*?\.js|(?:(?!(?:\/|^)\.).)*?\/m\/(?!\.)(?=.)[^/]*?\.js|(?:(?!(?:\/|^)\.).)*?\/o\/(?!\.)(?=.)[^/]*?\.js|(?:(?!(?:\/|^)\.).)*?\/q\/(?!\.)(?=.)[^/]*?\.js|(?:(?!(?:\/|^)\.).)*?\/s\/(?!\.)(?=.)[^/]*?\.js|(?:(?!(?:\/|^)\.).)*?\/u\/(?!\.)(?=.)[^/]*?\.js|(?:(?!(?:\/|^)\.).)*?\/w\/(?!\.)(?=.)[^/]*?\.js|(?:(?!(?:\/|^)\.).)*?\/y\/(?!\.)(?=.)[^/]*?\.js)$/);

var actual = fn("**/{a..c}/*.js");
actual.should.eql(/^(?:(?:(?!(?:\/|^)\.).)*?\/(?!\.)(?=.)[a-c]\/(?!\.)(?=.)[^/]*?\.js)$/);

var actual = fn("**/{1..10}/*.js");
actual.should.eql(/^(?:(?:(?!(?:\/|^)\.).)*?\/(?!\.)(?=.)[1-10]\/(?!\.)(?=.)[^/]*?\.js)$/);

var actual = fn("**/{1..10..2}/*.js");
actual.should.eql(/^(?:(?:(?!(?:\/|^)\.).)*?\/1\/(?!\.)(?=.)[^/]*?\.js|(?:(?!(?:\/|^)\.).)*?\/3\/(?!\.)(?=.)[^/]*?\.js|(?:(?!(?:\/|^)\.).)*?\/5\/(?!\.)(?=.)[^/]*?\.js|(?:(?!(?:\/|^)\.).)*?\/7\/(?!\.)(?=.)[^/]*?\.js|(?:(?!(?:\/|^)\.).)*?\/9\/(?!\.)(?=.)[^/]*?\.js)$/);

var actual = fn("a");
actual.should.eql(/^(?:a)$/);

var actual = fn("a/");
actual.should.eql(/^(?:a\/)$/);

var actual = fn("a/*");
actual.should.eql(/^(?:a\/(?!\.)(?=.)[^/]*?)$/);

var actual = fn(".*");
actual.should.eql(/^(?:(?=.)\.[^/]*?)$/);

var actual = fn("**/**/.*");
actual.should.eql(/^(?:(?:(?!(?:\/|^)\.).)*?\/(?:(?!(?:\/|^)\.).)*?\/(?=.)\.[^/]*?)$/);

var actual = fn("**/.*/.*");
actual.should.eql(/^(?:(?:(?!(?:\/|^)\.).)*?\/(?=.)\.[^/]*?\/(?=.)\.[^/]*?)$/);

var actual = fn("**/.*");
actual.should.eql(/^(?:(?:(?!(?:\/|^)\.).)*?\/(?=.)\.[^/]*?)$/);

var actual = fn("**/*.*");
actual.should.eql(/^(?:(?:(?!(?:\/|^)\.).)*?\/(?!\.)(?=.)[^/]*?\.[^/]*?)$/);

var actual = fn("**/*.");
actual.should.eql(/^(?:(?:(?!(?:\/|^)\.).)*?\/(?!\.)(?=.)[^/]*?\.)$/);

var actual = fn("**/*.a");
actual.should.eql(/^(?:(?:(?!(?:\/|^)\.).)*?\/(?!\.)(?=.)[^/]*?\.a)$/);

var actual = fn("**/*.js");
actual.should.eql(/^(?:(?:(?!(?:\/|^)\.).)*?\/(?!\.)(?=.)[^/]*?\.js)$/);

var actual = fn("**/*.md");
actual.should.eql(/^(?:(?:(?!(?:\/|^)\.).)*?\/(?!\.)(?=.)[^/]*?\.md)$/);

var actual = fn("**/.*");
actual.should.eql(/^(?:(?:(?!(?:\/|^)\.).)*?\/(?=.)\.[^/]*?)$/);

var actual = fn("**/.*.js");
actual.should.eql(/^(?:(?:(?!(?:\/|^)\.).)*?\/(?=.)\.[^/]*?\.js)$/);

var actual = fn("**/.*.md");
actual.should.eql(/^(?:(?:(?!(?:\/|^)\.).)*?\/(?=.)\.[^/]*?\.md)$/);

var actual = fn("**/.a");
actual.should.eql(/^(?:(?:(?!(?:\/|^)\.).)*?\/\.a)$/);

var actual = fn("**/.a.js");
actual.should.eql(/^(?:(?:(?!(?:\/|^)\.).)*?\/\.a\.js)$/);

var actual = fn("**/.gitignore");
actual.should.eql(/^(?:(?:(?!(?:\/|^)\.).)*?\/\.gitignore)$/);

var actual = fn("*.*");
actual.should.eql(/^(?:(?!\.)(?=.)[^/]*?\.[^/]*?)$/);

var actual = fn("*.a");
actual.should.eql(/^(?:(?!\.)(?=.)[^/]*?\.a)$/);

var actual = fn("*.gitignore");
actual.should.eql(/^(?:(?!\.)(?=.)[^/]*?\.gitignore)$/);

var actual = fn("*.{gitignore,*}");
actual.should.eql(/^(?:(?!\.)(?=.)[^/]*?\.gitignore|(?!\.)(?=.)[^/]*?\.[^/]*?)$/);

var actual = fn("*.{*,gitignore,js}");
actual.should.eql(/^(?:(?!\.)(?=.)[^/]*?\.[^/]*?|(?!\.)(?=.)[^/]*?\.gitignore|(?!\.)(?=.)[^/]*?\.js)$/);

var actual = fn("*.{*,gitignore}");
actual.should.eql(/^(?:(?!\.)(?=.)[^/]*?\.[^/]*?|(?!\.)(?=.)[^/]*?\.gitignore)$/);

var actual = fn(".{*,gitignore}");
actual.should.eql(/^(?:(?=.)\.[^/]*?|\.gitignore)$/);

var actual = fn("**/.{*,gitignore}");
actual.should.eql(/^(?:(?:(?!(?:\/|^)\.).)*?\/(?=.)\.[^/]*?|(?:(?!(?:\/|^)\.).)*?\/\.gitignore)$/);

var actual = fn("**/.{js,gitignore}");
actual.should.eql(/^(?:(?:(?!(?:\/|^)\.).)*?\/\.js|(?:(?!(?:\/|^)\.).)*?\/\.gitignore)$/);

var actual = fn("**/.{js,md}");
actual.should.eql(/^(?:(?:(?!(?:\/|^)\.).)*?\/\.js|(?:(?!(?:\/|^)\.).)*?\/\.md)$/);

var actual = fn("**/*.{js,md}");
actual.should.eql(/^(?:(?:(?!(?:\/|^)\.).)*?\/(?!\.)(?=.)[^/]*?\.js|(?:(?!(?:\/|^)\.).)*?\/(?!\.)(?=.)[^/]*?\.md)$/);

var actual = fn("**/(a|b)/*.{js,md}");
actual.should.eql(/^(?:(?:(?!(?:\/|^)\.).)*?\/(a|b)\/(?!\.)(?=.)[^/]*?\.js|(?:(?!(?:\/|^)\.).)*?\/(a|b)\/(?!\.)(?=.)[^/]*?\.md)$/);

var actual = fn("**/[a-z]/*.{js,md}");
actual.should.eql(/^(?:(?:(?!(?:\/|^)\.).)*?\/(?!\.)(?=.)[a-z]\/(?!\.)(?=.)[^/]*?\.js|(?:(?!(?:\/|^)\.).)*?\/(?!\.)(?=.)[a-z]\/(?!\.)(?=.)[^/]*?\.md)$/);

var actual = fn("*.js");
actual.should.eql(/^(?:(?!\.)(?=.)[^/]*?\.js)$/);

var actual = fn("*.md");
actual.should.eql(/^(?:(?!\.)(?=.)[^/]*?\.md)$/);

var actual = fn("*.{js,txt}");
actual.should.eql(/^(?:(?!\.)(?=.)[^/]*?\.js|(?!\.)(?=.)[^/]*?\.txt)$/);

var actual = fn("*/*.gitignore");
actual.should.eql(/^(?:(?!\.)(?=.)[^/]*?\/(?!\.)(?=.)[^/]*?\.gitignore)$/);

var actual = fn("*/.gitignore");
actual.should.eql(/^(?:(?!\.)(?=.)[^/]*?\/\.gitignore)$/);

var actual = fn(".a");
actual.should.eql(/^(?:\.a)$/);

var actual = fn(".gitignore");
actual.should.eql(/^(?:\.gitignore)$/);

var actual = fn(".js");
actual.should.eql(/^(?:\.js)$/);

var actual = fn(".md");
actual.should.eql(/^(?:\.md)$/);

var actual = fn("a/**/c/*.js");
actual.should.eql(/^(?:a\/(?:(?!(?:\/|^)\.).)*?\/c\/(?!\.)(?=.)[^/]*?\.js)$/);

var actual = fn("a/**/c/*.md");
actual.should.eql(/^(?:a\/(?:(?!(?:\/|^)\.).)*?\/c\/(?!\.)(?=.)[^/]*?\.md)$/);

var actual = fn("a/**/j/**/z/*.js");
actual.should.eql(/^(?:a\/(?:(?!(?:\/|^)\.).)*?\/j\/(?:(?!(?:\/|^)\.).)*?\/z\/(?!\.)(?=.)[^/]*?\.js)$/);

var actual = fn("a/**/j/**/z/*.md");
actual.should.eql(/^(?:a\/(?:(?!(?:\/|^)\.).)*?\/j\/(?:(?!(?:\/|^)\.).)*?\/z\/(?!\.)(?=.)[^/]*?\.md)$/);

var actual = fn("a/**/z/*.js");
actual.should.eql(/^(?:a\/(?:(?!(?:\/|^)\.).)*?\/z\/(?!\.)(?=.)[^/]*?\.js)$/);

var actual = fn("a/**/z/*.md");
actual.should.eql(/^(?:a\/(?:(?!(?:\/|^)\.).)*?\/z\/(?!\.)(?=.)[^/]*?\.md)$/);

var actual = fn("a/*.js");
actual.should.eql(/^(?:a\/(?!\.)(?=.)[^/]*?\.js)$/);

var actual = fn("a/*.md");
actual.should.eql(/^(?:a\/(?!\.)(?=.)[^/]*?\.md)$/);

var actual = fn("a/*.txt");
actual.should.eql(/^(?:a\/(?!\.)(?=.)[^/]*?\.txt)$/);

var actual = fn("a/*/.b");
actual.should.eql(/^(?:a\/(?!\.)(?=.)[^/]*?\/\.b)$/);

var actual = fn("a/*/.b.a");
actual.should.eql(/^(?:a\/(?!\.)(?=.)[^/]*?\/\.b\.a)$/);

var actual = fn("a/*/?/**/e.js");
actual.should.eql(/^(?:a\/(?!\.)(?=.)[^/]*?\/(?!\.)(?=.)[^/]\/(?:(?!(?:\/|^)\.).)*?\/e\.js)$/);

var actual = fn("a/*/?/**/e.md");
actual.should.eql(/^(?:a\/(?!\.)(?=.)[^/]*?\/(?!\.)(?=.)[^/]\/(?:(?!(?:\/|^)\.).)*?\/e\.md)$/);

var actual = fn("a/*/b");
actual.should.eql(/^(?:a\/(?!\.)(?=.)[^/]*?\/b)$/);

var actual = fn("a/*/c/*.js");
actual.should.eql(/^(?:a\/(?!\.)(?=.)[^/]*?\/c\/(?!\.)(?=.)[^/]*?\.js)$/);

var actual = fn("a/*/c/*.md");
actual.should.eql(/^(?:a\/(?!\.)(?=.)[^/]*?\/c\/(?!\.)(?=.)[^/]*?\.md)$/);

var actual = fn("a/.*/b");
actual.should.eql(/^(?:a\/(?=.)\.[^/]*?\/b)$/);

var actual = fn("a/?/**/e.js");
actual.should.eql(/^(?:a\/(?!\.)(?=.)[^/]\/(?:(?!(?:\/|^)\.).)*?\/e\.js)$/);

var actual = fn("a/?/**/e.md");
actual.should.eql(/^(?:a\/(?!\.)(?=.)[^/]\/(?:(?!(?:\/|^)\.).)*?\/e\.md)$/);

var actual = fn("a/?/c.js");
actual.should.eql(/^(?:a\/(?!\.)(?=.)[^/]\/c\.js)$/);

var actual = fn("a/?/c.md");
actual.should.eql(/^(?:a\/(?!\.)(?=.)[^/]\/c\.md)$/);

var actual = fn("a/?/c/?/*/e.js");
actual.should.eql(/^(?:a\/(?!\.)(?=.)[^/]\/c\/(?!\.)(?=.)[^/]\/(?!\.)(?=.)[^/]*?\/e\.js)$/);

var actual = fn("a/?/c/?/*/e.md");
actual.should.eql(/^(?:a\/(?!\.)(?=.)[^/]\/c\/(?!\.)(?=.)[^/]\/(?!\.)(?=.)[^/]*?\/e\.md)$/);

var actual = fn("a/?/c/?/e.js");
actual.should.eql(/^(?:a\/(?!\.)(?=.)[^/]\/c\/(?!\.)(?=.)[^/]\/e\.js)$/);

var actual = fn("a/?/c/?/e.md");
actual.should.eql(/^(?:a\/(?!\.)(?=.)[^/]\/c\/(?!\.)(?=.)[^/]\/e\.md)$/);

var actual = fn("a/?/c/???/e.js");
actual.should.eql(/^(?:a\/(?!\.)(?=.)[^/]\/c\/(?!\.)(?=.)[^/][^/][^/]\/e\.js)$/);

var actual = fn("a/?/c/???/e.md");
actual.should.eql(/^(?:a\/(?!\.)(?=.)[^/]\/c\/(?!\.)(?=.)[^/][^/][^/]\/e\.md)$/);

var actual = fn("a/??/c.js");
actual.should.eql(/^(?:a\/(?!\.)(?=.)[^/][^/]\/c\.js)$/);

var actual = fn("a/??/c.md");
actual.should.eql(/^(?:a\/(?!\.)(?=.)[^/][^/]\/c\.md)$/);

var actual = fn("a/???/c.js");
actual.should.eql(/^(?:a\/(?!\.)(?=.)[^/][^/][^/]\/c\.js)$/);

var actual = fn("a/???/c.md");
actual.should.eql(/^(?:a\/(?!\.)(?=.)[^/][^/][^/]\/c\.md)$/);

var actual = fn("a/????/c.js");
actual.should.eql(/^(?:a\/(?!\.)(?=.)[^/][^/][^/][^/]\/c\.js)$/);

var actual = fn("a/????/c.md");
actual.should.eql(/^(?:a\/(?!\.)(?=.)[^/][^/][^/][^/]\/c\.md)$/);

var actual = fn("a/b/**/c{d,e}/**/xyz.js");
actual.should.eql(/^(?:a\/b\/(?:(?!(?:\/|^)\.).)*?\/cd\/(?:(?!(?:\/|^)\.).)*?\/xyz\.js|a\/b\/(?:(?!(?:\/|^)\.).)*?\/ce\/(?:(?!(?:\/|^)\.).)*?\/xyz\.js)$/);

var actual = fn("a/b/**/c{d,e}/**/xyz.md");
actual.should.eql(/^(?:a\/b\/(?:(?!(?:\/|^)\.).)*?\/cd\/(?:(?!(?:\/|^)\.).)*?\/xyz\.md|a\/b\/(?:(?!(?:\/|^)\.).)*?\/ce\/(?:(?!(?:\/|^)\.).)*?\/xyz\.md)$/);

var actual = fn("a/b/c/*.js");
actual.should.eql(/^(?:a\/b\/c\/(?!\.)(?=.)[^/]*?\.js)$/);

var actual = fn("A/b/C/*.js");
actual.should.eql(/^(?:A\/b\/C\/(?!\.)(?=.)[^/]*?\.js)$/);

var actual = fn("a/b/c/*.md");
actual.should.eql(/^(?:a\/b\/c\/(?!\.)(?=.)[^/]*?\.md)$/);

var actual = fn("A/b/C/*.md");
actual.should.eql(/^(?:A\/b\/C\/(?!\.)(?=.)[^/]*?\.md)$/);

var actual = fn("A/b/C/*.MD");
actual.should.eql(/^(?:A\/b\/C\/(?!\.)(?=.)[^/]*?\.MD)$/);

var actual = fn("a/b/c{d,e{f,g}}/*.js");
actual.should.eql(/^(?:a\/b\/cd\/(?!\.)(?=.)[^/]*?\.js|a\/b\/cef\/(?!\.)(?=.)[^/]*?\.js|a\/b\/ceg\/(?!\.)(?=.)[^/]*?\.js)$/);

var actual = fn("a/b/c{d,e{f,g}}/*.md");
actual.should.eql(/^(?:a\/b\/cd\/(?!\.)(?=.)[^/]*?\.md|a\/b\/cef\/(?!\.)(?=.)[^/]*?\.md|a\/b\/ceg\/(?!\.)(?=.)[^/]*?\.md)$/);

var actual = fn("a/b/c{d,e}/*.js");
actual.should.eql(/^(?:a\/b\/cd\/(?!\.)(?=.)[^/]*?\.js|a\/b\/ce\/(?!\.)(?=.)[^/]*?\.js)$/);

var actual = fn("a/b/c{d,e}/*.md");
actual.should.eql(/^(?:a\/b\/cd\/(?!\.)(?=.)[^/]*?\.md|a\/b\/ce\/(?!\.)(?=.)[^/]*?\.md)$/);

var actual = fn("a/b/c{d,e}/xyz.js");
actual.should.eql(/^(?:a\/b\/cd\/xyz\.js|a\/b\/ce\/xyz\.js)$/);

var actual = fn("a/b/c{d,e}/xyz.md");
actual.should.eql(/^(?:a\/b\/cd\/xyz\.md|a\/b\/ce\/xyz\.md)$/);

var actual = fn("a/{c..e}.js");
actual.should.eql(/^(?:a\/(?!\.)(?=.)[c-e]\.js)$/);

var actual = fn("E:**/*.js");
actual.should.eql(/^(?:(?=.)E:[^/]*?[^/]*?\/(?!\.)(?=.)[^/]*?\.js)$/);

var actual = fn("E:**/*.md");
actual.should.eql(/^(?:(?=.)E:[^/]*?[^/]*?\/(?!\.)(?=.)[^/]*?\.md)$/);

var actual = fn("E:\\**/*.js");
actual.should.eql(/^(?:(?=.)E:\\[^/]*?[^/]*?\/(?!\.)(?=.)[^/]*?\.js)$/);

var actual = fn("E:\\**/*.md");
actual.should.eql(/^(?:(?=.)E:\\[^/]*?[^/]*?\/(?!\.)(?=.)[^/]*?\.md)$/);
