import { execSync } from "child_process";
import fs from "fs";
import path from "path";

function getTemplate(src: string) {
  const templatePath = path.resolve(src);
  return fs.readFileSync(templatePath).toString();
}

function badges(content: string, config: { addNewLine: boolean; appendToOriginalContent: boolean; }, template: string): string {
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

function applyTransform(data: string, config: { placeholder: string; originalPath: string; }) {
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

module.exports = function(content: string, pluginOptions: any, data: any) {
  // setup plugin config
  const defaultOptions = {
    addNewLine: false
  };

  const originalPath: string = data.originalPath;

  const userOptions = pluginOptions || {};
  const pluginConfig = { defaultOptions, ...userOptions, originalPath };

  // get and transform template contents.
  let template = getTemplate(pluginConfig.src);
  template = applyTransform(template, pluginConfig);

  // return the transform function
  return badges(content, pluginConfig, template);
};
