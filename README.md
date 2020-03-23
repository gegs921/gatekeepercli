# gatekeepercli

*A cli that creates a .env file for you*

![Usage Gif](readmeCont/gkgif.gif)

**Why Would You Use This?**

This CLI is especially useful if you just cloned a repository and it has a javascript or javascript file(s) that have many environment variables defined.

**Installation**

`$ npm install -g gatekeepercli`

**Usage**

Creates .env file for single javascript file:
 - `[filename]` is the javascript file you would like to get the env vars from

`$ gk create [filename]`

Creates .env file for all javascript files in a directory:
 - `[directory]` is the directory you would like to get the env vars from

`$ gk creatDir [directory]`