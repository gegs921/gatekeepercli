# gatekeepercli

*A cli that creates a .env file for you*

![Usage Gif](readmeCont/gkgif.gif)

### Why Would You Use This?

This CLI is especially useful if you just cloned a repository and it has a javascript or javascript file(s) that have many environment variables defined.

### Installation

`$ npm install -g gatekeepercli`

### Usage

`$ gk create [filename]`

Creates `.env` file for single javascript file:
 - `[filename]` is the javascript file you would like to get the env vars from

`$ gk createDir [directory]`

Creates `.env` file for all javascript files in a directory:
 - `[directory]` is the directory you would like to get the env vars from

`$ gk gitignore`

Adds `.env` to existing or nonexisting gitignore

`$ gk createRev [file] [dir] [filename]`

Creates `.js` file with variables based off of variables in a `.env` file
  - `[file]` is the path to the `.env` file
  - `[dir]` is the directory you want to save the new `.js` file to.
    - directory can be nonexistent
  - `[filename]` is the name of the new `.js` file
    - example: `$ gk createRev .env newjsfiledir env.js`