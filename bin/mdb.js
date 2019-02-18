const chalk = require('chalk');
const glob = require('glob');
const shell = require('shelljs');
const log = console.log;

const generateHook = () => {
  console.log('generating hook..');
}

const updateFile = (path) => {
  if(!path) {
    log(chalk`{bold.redBright ${`error: `}}{yellowBright ${`Please specify the path to the file.`}}\n{greenBright ${`For details on how to use, please refer docs: `}}{underline.green ${'https://github.com/rishichawda/markdown-magic-build-badge'}}`
    );
  } else {
    glob(path, function(err, files) {
      if(err) {
	console.log(err);
      } else {
	if(files.length === 1) {
	  log(chalk.green`Updating docs..`);
          shell.exec(`node ${files[0]}`);
	} else if(files.length > 1) {
	  log(chalk`{keyword('orange') ${'warning: '}}{yellowBright ${'Multiple files with the same name found! Exiting..'}}\n{bold.greenBright ${'Please specify the path to the plugin\'s entry file.'}}`)
	} else {
	  log(chalk`{bold.redBright ${`error: `}}{yellowBright ${`Failed to find the file specified.`}}`);
	}
      }
    });
  }
}

module.exports = {
  updateFile,
  generate: generateHook,
}
