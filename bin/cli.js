#!/usr/bin/env node
const updateNotifer = require("update-notifier");
const meow = require("meow");
const mdbCli = require("./mdb.js");
const utils = require("./utils.js");
const pkg = require("../package.json");

updateNotifer({ pkg }).notify();

const cliOptions = meow(
  `
  Usage
    $ markdown-badge
  Options
    --update-docs, -u     Update file with correct badge url. Requires configuration file path.
    --generate-hook, -g   Generate hooks for markdown badge.
    --version, -v         Print installed markdown-badge version
  Examples
    $ markdown-badge -u ./generateBadges.js
    $ markdown-badge -g
`,
  {
    flags: {
      updateDocs: { type: "string", alias: "u" },
      generateHook: { type: "boolean", alias: "g" },
      version: { type: "boolean", alias: "v" }
    }
  }
);

const options = {
  updateDocs: data => mdbCli.updateFile(data),
  generateHook: () => mdbCli.generate()
};

utils.mapCommands(cliOptions, options);
