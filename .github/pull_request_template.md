Hello, and thanks for contributing to micromatch!

## tldr

There are three main goals in this document, depending on the nature of your pr:

- [description](#description): please tell us about your pr
- [checklist](#checklist): please review the checklist that is most closly related to your pr

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

### Documentation

- [ ] Please review the [readme advice](#readme-advice) section before submitting changes

### Bug Fix

- [ ] All existing unit tests are still passing (if applicable)
- [ ] Add new passing unit tests to cover the code introduced by your pr
- [ ] Update the readme (see [readme advice](#readme-advice))
- [ ] Update or add any necessary API documentation

### New Feature

- [ ] If this is a big feature with breaking changes, consider [opening an issue][issues] to discuss first. This is completely up to you, but please keep in mind that your pr might not be accepted.
- [ ] Run unit tests to ensure all existing tests are still passing
- [ ] Add new passing unit tests to cover the code introduced by your pr
- [ ] Update the readme (see [readme advice](#readme-advice))

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

[issues]: ../../issues
[verb]: https://github.com/verbose/verb
