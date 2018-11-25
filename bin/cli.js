#!/usr/bin/env node
const glob = require("glob");
const shelljs = require("shelljs");
const path = require("path");
const fs = require("fs");

glob(path.join(process.cwd(), ".git/hooks/post-checkout"), function(
  err,
  files
) {
  if (err) {
    console.error(`Unable to verify as a git repository. Try running \`git init\` and initialising ${__dirname} as a git repository.`)
    throw err;
  }
  if (files.length) {
    try {
        const filecontent = fs.readFileSync(files[0]).toString();
    } catch(error) {
        console.error(`Unable to read file ${files[0]}`);
        throw err;
    }
    glob(`node_modules/markdown-magic-branch-badge/**/post-checkout`, function(
      er,
      files
    ) {
      if (er) {
        console.error('Unable to fetch githook.');
        throw er;
      }
      try {
          const hookcontent = fs.readFileSync(path.join(process.cwd(), files[0]));
          if (filecontent.indexOf(hookcontent) >= 0) {
            console.log("post-checkout hook already exists");
          }
      } catch(error) {
          console.error('Unable to fetch githook.');
          throw error;
      }
    });
  } else {
    glob(`node_modules/markdown-magic-branch-badge/**/post-checkout`, function(
      er,
      files
    ) {
      if (er) {
        console.error('Unable to fetch githook.');
        throw er;
      }
      shelljs.cp(files[0], path.join(process.cwd(), ".git/hooks/"));
    });
  }
});