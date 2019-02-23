const chalk = require("chalk");
const glob = require("glob");
const shell = require("shelljs");
const path = require("path");
const fs = require("fs");
const log = console.log;

const generateHook = () => {
  glob(".git", function(err, files) {
    if (err || !files.length) {
      log(
        chalk`{bold.redBright Error: }{yellowBright ${err ||
          `Unable to verify as a git repository. Try running \`git init\` and initialising`}} ${chalk.black.bgYellowBright(
          process.cwd()
        )} {yellowBright ${`as a git repository.`}}`
      );
      return;
    }
    glob(".git/hooks/post-checkout", function(err, files) {
      if (err) {
        log(chalk`{bold.redBright Error: }{yellowBright \n${err}}`);
      } else {
        if (files[0]) {
          // A githook already exists in repository.
          try {
            glob(
              `node_modules/markdown-magic-branch-badge/**/post-checkout`,
              function(er, files) {
                if (er) {
                  log(
                    chalk`{bold.redBright Error fetching githook: }{yellowBright \n${er}}`
                  );
                }
                try {
                  const hookcontent = fs.readFileSync(
                    path.join(process.cwd(), files[0])
                  );
                  const filecontent = fs.readFileSync(files[0]).toString();
                  if (filecontent.indexOf(hookcontent) >= 0) {
                    log(
                      chalk.keyword("orange")(
                        "Post-checkout hook already exists!"
                      )
                    );
                    return;
                  } else {
                    // add hook to original hook
                  }
                } catch (error) {
                  log(
                    chalk`{bold.redBright Error reading githook: }{yellowBright \n${error}}`
                  );
                }
              }
            );
          } catch (error) {
            throw err;
          }
        } else {
          // Add githook to the git repository.
          glob(
            `node_modules/markdown-magic-branch-badge/**/post-checkout`,
            function(er, files) {
              if (er) {
                log(
                  chalk`{bold.redBright Error fetching githook: }{yellowBright \n${er}}`
                );
              }
              shell.cp(files[0], path.join(process.cwd(), ".git/hooks/"));
              log(chalk.greenBright`Successfully added githook.`);
            }
          );
        }
      }
    });
  });
};

const updateFile = path => {
  if (!path) {
    log(
      chalk`{bold.redBright Error: }{yellowBright Please specify the path to the file.}\n{greenBright For details on how to use, please refer docs: }{underline.green https://github.com/rishichawda/markdown-magic-build-badge}`
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
            chalk`{keyword('orange') Warning: }{yellowBright Multiple files with the same name found! Exiting..}\n{bold.greenBright Please specify the path to the plugin's entry file.}`
          );
        } else {
          log(
            chalk`{bold.redBright Error: }{yellowBright Failed to find the file specified.}`
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
