# release-assist

Small help with new releases of your node.js and frontend projects.

You may consider using it if...

- You're maintaining any node.js or frontend project that uses semantic versioning.
- You use git.
- You're sick of doing repetitive tasks required for every new release, like bumping the version and editing changelog. Release-assist helps automating those steps.

## Installation

Install it globally:

```
npm install -g release-assist
```

Or if you're like me and you don't like any globally installed crap, add it directly to the project:

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

1.  Do checks that your local repository is on correct branch and in sync with origin repository, so you know no mistake happened and you didn't miss any commits done by your teammates.
2.  Will help you decide what semver-complaint version this release should have.
3.  Will prepare new release entry in `CHANGELOG.md` with all commit messages since the last release.

The changelog state release-assist leaves you with is most probably not final, but now your job of manually editing the changelog to give it the final form is much easier.

After you're done with the changelog run command:

```
release-assist --finish
```

This commits the local changes with proper version number as a commit message, so with next release this tool can keep track of everything. Now we're done here, do the real release of your project!

## Integrating into existing projects

1.  This tool expects the changelog file to be named `CHANGELOG.md`, if your is called differently you need to change the name (or subit a github issue to see what we can do).
2.  This tool expects that `CHANGELOG.md` have very specific structure (after all we need to parse this file). See changelog of this project as an example. Parsing script expects release header to be in format `# version (YYYY-MM-DD)` below the header everything is treated as release description until next header is spotted.
3.  The release commit need to have commit message `x.x.x` (just the version number) if you have given those commits different messages in the past then release-assist won't be able to find previous release and fill changelog with all commits of your project, but this will happen only once (for the first release done with release-assist), after that everything will be working as intended.

# License

Released under the ISC license.
