import chalk from "chalk";
import glob from "glob";
import shell from "shelljs";
import path from "path";
import fs from "fs";
const log = console.log;

const generateHook = () => {
  glob(".git", function(err: any, files: { length: number; }) {
    if (err || !files.length || !shell.which("git")) {
      log(
        chalk`{bold.redBright Error: }{yellowBright ${err ||
          `Unable to verify as a git repository. Try running \`git init\` and initialising`}} ${chalk.black.bgYellowBright(
          process.cwd()
        )} {yellowBright ${`as a git repository.`}}`
      );
      return;
    }
    glob(".git/hooks/post-checkout", function(err: any, files: string[]) {
      if (err) {
        log(chalk`{bold.redBright Error: }{yellowBright \n${err}}`);
      } else {
        if (files[0]) {
          // A githook already exists in repository.
          try {
            glob(
              `node_modules/markdown-magic-branch-badge/**/post-checkout`,
              function(er: any, file: string[]) {
                if (er) {
                  log(
                    chalk`{bold.redBright Error fetching githook: }{yellowBright \n${er}}`
                  );
                  return;
                }
                try {
                  let hookcontent = fs
                    .readFileSync(path.join(process.cwd(), file[0]))
                    .toString();
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
                    if (filecontent.indexOf("#!/bin/bash") >= 0) {
                      hookcontent = hookcontent.split("\n").slice(2).join("\n");
                    }
                    fs.appendFile(files[0], `\n${hookcontent}`, function(err: any) {
                      if (err) {
                        log(
                          chalk`{bold.redBright Error adding githook: }{yellowBright \n${err}}`
                        );
                      } else {
                        log(chalk.greenBright`Successfully added githook.`);
                      }
                    });
                    return;
                  }
                } catch (error) {
                  log(
                    chalk`{bold.redBright Error reading githook: }{yellowBright \n${error}}`
                  );
                  return;
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
            function(er: any, files: string[]) {
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

const updateFile = (path: string) => {
  if (!path) {
    log(
      chalk`{bold.redBright Error: }{yellowBright Please specify the path to the file.}\n{greenBright For details on how to use, please refer docs: }{underline.green https://github.com/rishichawda/markdown-magic-build-badge}`
    );
  } else {
    glob(path, function(err: any, files: string[]) {
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

export default {
  updateFile,
  generate: generateHook
};
