#!/usr/bin/env node
import updateNotifer from "update-notifier";
import meow from "meow";
import mdbCli from "./mdb";
import utils from "./utils";
import chalk from 'chalk';
import figlet from 'figlet';
const pkg = require("../package.json");

updateNotifer({ pkg }).notify();

console.log(
  chalk.yellow(
    figlet.textSync('mmbb', { horizontalLayout: 'full' })
  )
);

const cliOptions: any = meow(
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
  updateDocs: (filePath: string) => mdbCli.updateFile(filePath),
  generateHook: () => mdbCli.generate()
};

utils.mapCommands(cliOptions, options);
