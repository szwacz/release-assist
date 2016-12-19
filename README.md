# release-assist

Helps you releasing new versions of your node.js and frontend projects.

You may consider using it if...
- You're maintaining any node.js or frontend project.
- That project uses git.
- You're sick of doing repetitive tasks required for every new release (bumping the version, editing changelog, git-tagging the release). Release-assist helps automating those steps.

![](http://szwacz.com/cd/release-assist.gif)

## Installation

Install it globally:
```
npm install -g release-assist
```

Or if you're like me and doesn't like any globally installed crap, add it directly to the project:
```
npm install --save-dev release-assist
```
And expose the scripts via `package.json` file:
```json
{
  "scripts": {
    "release-start": "release-assist --start",
    "release-finish": "release-assist --finish"
  }
}
```

## Usage

Ok, you've just merged new code to master branch of your project and now are ready to release it as new version. Open terminal in root directory of your project (where `package.json` resides) and run command:

```
release-assist --start
```

This will:

1. Do checks that your local repository is on correct branch and in sync with origin repository, so you know no mistake happened and you didn't miss any commits done by your teammates.
2. Will ask you for new version number.
3. Will prepare new release entry in `CHANGELOG.md` with commit messages since the last release.

The changelog state release-assist left you with is most probably not final, but now your job of manually editing the changelog to give it the final form is much simpler.

After you're done with the changelog run command:

```
release-assist --finish
```
This will:

1. Commit the changes as a release (with new version as commit message).
2. Create git tag for the new release.
3. Push release and newly created tag to origin repository.

Done! The release is ready. It took 60 seconds instead of 5 minutes, and you're sure that freakin' version tag has been pushed to origin and remembering about pushing it didn't slip your mind 4th time this month.

## Integrating into existing projects

1. This tool expects the changelog file to be named `CHANGELOG.md`, if your is called differently you need to change the name (or subit a github issue to see what we can do).
2. This tool expects that `CHANGELOG.md` have very specific structure (after all the script must be able to parse this file). See changelog of this project as an example. Parsing script expects release header to be in format `# version (YYYY-MM-DD)` below the header everything is treated as release description until next header is spotted.
3. The release commit need to have commit message `x.x.x` (just the version number) if you have given those commits different messages in the past then release-assist won't be able to find previous release and fill changelog with all commits of your project, but this will happen only once (for the first release done with release-assist), after that everything will be working as intended.

# License (ISC)

Copyright (c) 2016, Jakub Szwacz

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
