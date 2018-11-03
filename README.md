## markdown-magic-branch-badge

:star2: A plugin to update your branch badges to point to correct branch status via [markdown-magic](https://github.com/DavidWells/markdown-magic).

Supports all major vendors like [TravisCI](http://travis-ci.org/), [Codecov](https://codecov.io/), [CircleCI](https://circleci.com/) and many more that provide code repository status images and badges for readme files. :tada:


<br /><br />
### Installation :

```
npm i markdown-magic markdown-magic-branch-badge --save-dev
```
<br />

### Usage :

Create a file `update-readme.js` in your project directory.

```
const path = require('path');
const transformMarkdown = require('markdown-magic');
const badgePlugin = require('markdown-magic-branch-badge');

const config = {
  transforms: {
    badgePlugin,
  },
};

function callback() {
  console.log('ReadME generated.');
}

const markdownPath = path.join(__dirname, 'README.md');
transformMarkdown(markdownPath, config, callback);
```
<br />Create a file, `example-template` with your template.

```
[![Travis (.org)](https://img.shields.io/travis/user/repo/{current_branch}.svg)](https://travis-ci.org/user/repo)
[![Some other badge](https://img.shields.io/somebadge/user/repo/{current_branch}.svg)](https://some_badge_url.com/user/repo)
```

You can use your custom placeholders through `placeholder` parameter. For the complete list of parameters, see [here](#config-options). If there is no `placeholder` parameter specified in your `README.md` file, the plugin will look for the default placeholder, i.e., `current_branch`.

**NOTE:** Placeholders must be wrapped in curly braces inside the template.




<br />On your `README.md` add the following lines :
```
<!-- AUTO-GENERATED-CONTENT:START (badgePlugin:src=./example-template) -->
<!-- AUTO-GENERATED-CONTENT:END -->
```

This indicates the plugin to add the badges between these comments in your readme file.

If you are using your own placeholder, you can specify it like this :

```
<!-- AUTO-GENERATED-CONTENT:START (badgePlugin:src=./example-template&placeholder=my_custom_placeholder) -->
<!-- AUTO-GENERATED-CONTENT:END -->
```




<br />Now, go to the terminal and run:

```
node ./update-readme.js
```

After running this command, now you should see the updated `README.md` with the badges according to your branch name.


### Config options

| Option | Description |
| ------------- | ------------- |
| src | Relative path to the template file. ( **Required** )  |
| addNewLine  | Specify whether to add a new line (`\n`) at the end of the written output. By default, it is set to `false`. |
| placeholder | Specify a custom placeholder for updating branch names.  |
<br />

##### Usage options:

1. You can use it as a script on your  `package.json` and run it manually, or
2. Use it in a `pre-commit` and `post-checkout` hooks to keep your branches updated with the correct badge URLs.
<br />




If you have any queries or requests, feel free to open an issue [here](https://github.com/rishichawda/markdown-magic-build-badge/issues) or open a pull request if you want to contribute! 
