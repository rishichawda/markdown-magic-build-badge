## markdown-magic-branch-badge

A plugin to update your branch badges to point to correct branch status.



#### Installation :

```
npm i markdown-magic markdown-magic-branch-badge --save-dev
```




#### Usage :

Create a file `update-readme.js` in your project directory.

```
const path = require('path');
const transformMarkdown = require('markdown-magic');
const travisBadgePlugin = require('markdown-magic-branch-badge');

const config = {
  transforms: {
    travisBadgePlugin,
  },
};

function callback() {
  console.log('ReadME generated.');
}

const markdownPath = path.join(__dirname, 'README.md');
transformMarkdown(markdownPath, config, callback);
```
Create a file, `example-template` with your template.

```
[![Travis (.org)](https://img.shields.io/travis/user/repo/{current_branch}.svg)](https://travis-ci.org/user/repo)
[![Some other badge](https://img.shields.io/somebadge/user/repo/{current_branch}.svg)](https://some_badge_url.com/user/repo)
```



On your `README.md` add the following lines :
```
<!-- AUTO-GENERATED-CONTENT:START (travisBadgePlugin:src=./example-template) -->
<!-- AUTO-GENERATED-CONTENT:END -->
```
This indicates the plugin to add the badges between these comments in your readme file.



**NOTE:** Use `{current_branch}` as placeholders for the plugin to update with branch respective names.

Now, go to the terminal and run:

```
node ./update-readme.js
```

After running this command, now you should see the updated `README.md` with the badges according to your branch name.

If you have any queries or requests, feel free to open an issue or open a pull request if you want to contribute! 



##### Usage options:

1. You can use it as a script on your  `package.json` and run it manually, or
2. Use it in a `pre-commit` and `post-checkout` hooks to keep your branches updated with the correct badge URLs.
