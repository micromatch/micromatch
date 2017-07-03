Hello, and thanks for contributing to micromatch!

## tldr

There are three main goals in this document, depending on the nature of your pr:

- [description](#description): please tell us about your pr
- [checklist](#checklist): please review the checklist that is most closly related to your pr
- [contributors list](#packagejson-contributors): you're one of us now, please add yourself to `package.json` and let the world know!

The following sections provide more detail on each.

**Improve this document**

Please don't hesitate to [ask questions][issues] for clarification, or to [make suggestions][issues] (or a pull request) to improve this document.

## Description

To help the project's maintainers and community to quickly understand the nature of your pull request, please create a description that incorporates the following elements:

- [] what is accomplished by the pr
- [] if there is something potentially controversial in your pr, please take a moment to tell us about your choices

## Checklist

Please use the checklist that is most closely related to your pr _(you only need to use one checklist, and you can skip items that aren't applicable or don't make sense)_:

- [fixing typos]()
- [documentation]()
- [bug fix]()
- [new feature]()
- [other]()

### Fixing typos

- [ ] Please review the [readme advice]() section before submitting changes
- [ ] Add your to the [contributors](#packagejson-contributors) array in package.json!

### Documentation

- [ ] Please review the [readme advice](#readme-advice) section before submitting changes
- [ ] Add your info to the [contributors](#packagejson-contributors) array in package.json!

### Bug Fix

- [ ] All existing unit tests are still passing (if applicable)
- [ ] Add new passing unit tests to cover the code introduced by your pr
- [ ] Update the readme (see [readme advice](#readme-advice))
- [ ] Update or add any necessary API documentation
- [ ] Add your info to the [contributors](#packagejson-contributors) array in package.json!

### New Feature

- [ ] If this is a big feature with breaking changes, consider [opening an issue][issues] to discuss first. This is completely up to you, but please keep in mind that your pr might not be accepted.
- [ ] Run unit tests to ensure all existing tests are still passing
- [ ] Add new passing unit tests to cover the code introduced by your pr
- [ ] Update the readme (see [readme advice](#readme-advice))
- [ ] Add your info to the [contributors](#packagejson-contributors) array in package.json!

Thanks for contributing!

## Readme advice

Please review this section if you are updating readme documentation.

**Readme template**

This project uses [verb][] for documentation. Verb generates the project's readme documentation from the [.verb.md](../.verb.md) template in the root of this project.

Make all documentation changes in `.verb.md`, and please _do not edit the readme.md directly_, or your changes might accidentally get overwritten.

**Code comments**

Please add code comments (following the same style as existing comments) to describe any code changes or new code introduced by your pull request.

**Optionally build the readme**

Any changes made `.verb.md` and/or code comments will be automatically incorporated into the README documentation the next time `verb` is run.

We can take care of building the documentation for you when we merge in your changes, or feel free to run [verb][] yourself. Whatever you prefer is fine with us.

## package.json contributors

**Add yourself!**

When adding your information to the `contributors` array in package.json, please use the following format (provide your name at minimum, the other fields are optional):

```
full name <email@address.com> (https://website.com)
```

**Example**

```json
// -- package.json --
{
  "name": "micromatch",
  "contributors": [
    "Brian Woodward <jon.schlinkert@sellside.com> (https://github.com/jonschlinkert)",
    "Jon Schlinkert <brian.woodward@sellside.com> (https://github.com/doowb)",
  ]
}
```

_(If a `contributors` array does not already exist, please feel free to add one wherever you want, and congratulations on being the first to contribute!)_

[issues]: ../../issues
[verb]: https://github.com/verbose/verb
