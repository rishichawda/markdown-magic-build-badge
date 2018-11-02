const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

function getTemplate(src) {
  const templatePath = path.resolve(src);
  return fs.readFileSync(templatePath).toString();
}

function badges(content, config, template) {
  const newLine = config.addNewLine === true ? "\n" : "";
  const appendedContent = config.appendToOriginalContent ? content : "";
  const updatedContent = appendedContent + template + newLine;
  return updatedContent;
}

function getCurrentBranch() {
  try {
    const data = execSync("git branch | grep \\* | cut -d ' ' -f2")
      .toString()
      .trim();

    return data;
  } catch (err) {
    console.log(err);
    throw new Error("Failed to get current branch name.");
  }
}

function applyTransform(data) {
  let branch = getCurrentBranch();

  let appendSlash = true;
  let replaceableContent = data.search("{current_branch}");
  if(replaceableContent === -1) {
    throw new Error('No placeholder found!');
  } else {
    appendSlash = data[replaceableContent-1] === '/' ? false : appendSlash;
  }

  function handleSlash() {
     return appendSlash ? `/${branch}` : branch;
  }

  return data.replace("{current_branch}", branch ? handleSlash() : "");
}

module.exports = function travisBadgePlugin(content, pluginOptions, config) {
  // setup plugin config
  const defaultOptions = {
    addNewLine: true
  };

  const userOptions = pluginOptions || {};
  const pluginConfig = { defaultOptions, ...userOptions };

  // get and transform template contents.
  let template = getTemplate(pluginConfig.src);
  template = applyTransform(template);

  // return the transform function
  return badges(content, pluginConfig, template);
};
