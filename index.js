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
    err = new Error("Failed to get current branch name.");
    throw err;
  }
}

function applyTransform(data, config) {
  let branch = getCurrentBranch();

  let appendSlash = true;
  let replaceableContent = data.search(
    config.placeholder ? `{${config.placeholder}}` : "{current_branch}"
  );
  if (replaceableContent === -1) {
    const err = new Error(
      `Unable to find the placeholder provided in ${config.originalPath}.`
    );
    throw err;
  } else {
    appendSlash = data[replaceableContent - 1] === "/" ? false : appendSlash;
  }

  function handleSlash() {
    return appendSlash ? `/${branch}` : branch;
  }

  return data
    .split(config.placeholder ? `{${config.placeholder}}` : "{current_branch}")
    .join(branch ? handleSlash() : "");
}

module.exports = function(content, pluginOptions, { originalPath }) {
  // setup plugin config
  const defaultOptions = {
    addNewLine: false
  };

  const userOptions = pluginOptions || {};
  const pluginConfig = { defaultOptions, ...userOptions, originalPath };

  // get and transform template contents.
  let template = getTemplate(pluginConfig.src);
  template = applyTransform(template, pluginConfig);

  // return the transform function
  return badges(content, pluginConfig, template);
};
