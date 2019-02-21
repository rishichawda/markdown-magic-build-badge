const chalk = require("chalk");
const glob = require("glob");
const shell = require("shelljs");
const path = require("path");
const fs = require("fs");
const log = console.log;

const generateHook = () => {
  glob(path.join(process.cwd(), ".git/hooks/post-checkout"), function(
    err,
    files
  ) {
    if (err) {
      console.error(
        `Unable to verify as a git repository. Try running \`git init\` and initialising ${__dirname} as a git repository.`
      );
      throw err;
    }
    if (files.length) {
      try {
        const filecontent = fs.readFileSync(files[0]).toString();
      } catch (error) {
        console.error(`Unable to read file ${files[0]}`);
        throw error;
      }
      glob(
        `node_modules/markdown-magic-branch-badge/**/post-checkout`,
        function(er, files) {
          if (er) {
            console.error("Unable to fetch githook.");
            throw er;
          }
          try {
            const hookcontent = fs.readFileSync(
              path.join(process.cwd(), files[0])
            );
            const filecontent = fs.readFileSync(files[0]).toString();
            if (filecontent.indexOf(hookcontent) >= 0) {
              console.log("post-checkout hook already exists");
            }
          } catch (error) {
            console.error("Unable to fetch githook.");
            throw error;
          }
        }
      );
    } else {
      glob(
        `node_modules/markdown-magic-branch-badge/**/post-checkout`,
        function(er, files) {
          if (er) {
            console.error("Unable to fetch githook.");
            throw er;
          }
          shell.cp(files[0], path.join(process.cwd(), ".git/hooks/"));
          log(chalk.greenBright`Successfully added githook.`);
        }
      );
    }
  });
};

const updateFile = path => {
  if (!path) {
    log(
      chalk`{bold.redBright ${`error: `}}{yellowBright ${`Please specify the path to the file.`}}\n{greenBright ${`For details on how to use, please refer docs: `}}{underline.green ${"https://github.com/rishichawda/markdown-magic-build-badge"}}`
    );
  } else {
    glob(path, function(err, files) {
      if (err) {
        console.log(err);
      } else {
        if (files.length === 1) {
          log(chalk.green`Updating docs..`);
          shell.exec(`node ${files[0]}`);
        } else if (files.length > 1) {
          log(
            chalk`{keyword('orange') ${"warning: "}}{yellowBright ${"Multiple files with the same name found! Exiting.."}}\n{bold.greenBright ${"Please specify the path to the plugin's entry file."}}`
          );
        } else {
          log(
            chalk`{bold.redBright ${`error: `}}{yellowBright ${`Failed to find the file specified.`}}`
          );
        }
      }
    });
  }
};

module.exports = {
  updateFile,
  generate: generateHook
};
