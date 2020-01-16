# Base Template with Jekyll and Gulp

This update involves making both the Jekyll project and compiled _site folder run using Gulp. It also includes the recent inclusion of Bootstrap 4 to the base template. It also removes Bower and introduces yarn for package management (At this stage for dev dependencies). The Jekyll build is managed by Gulp as well as introducing sourcemaps for easier development and finding the location of Sass affecting an element in Chrome dev tools. It also introduces watch tasks and uses browser sync to see changes instantly in the browser. The following is needed to run the project:

* Clone this repo/pull this branch
* Ensure you have the following installed globally. The versions listed are a guide and have been tested, but other versions may work too: 
  * __node 8.11.1__
  * __npm 5.6.0__ 
  * __ruby 2.4.4p296__
  * __bundler 1.16.3__ 
  * __yarn 1.7.0__
  * __gulp 3.9.1__
* Cd to repo and run yarn (All gulp dev dependencies are in the package.json file)
* Run bundle install
* Run gulp

Your project should build and browser sync should work. Making changes to Sass, JS or HTML pges should automatically update the _site and reload the page. To run Gulp on the _site folder, copy the _site folder to another location and rename it. Then cd to this new folder, run yarn and then gulp. This should behave the same way as the Jekyll project with watch tasks and browser sync enabled on HTML, Sass and JS.

## Whitelabel Plugin installation with Gulp

There is a new Gulp setup to install a plugin from the [Frontend Plugins repo](https://github.com/Arekibo/Frontend-Plugins). This clones the Frontend-plugins repo's master branch into the base template. It chooses a plugin folder from this repo *based on the parameter (the plugin folder name in the frontend plugins repo) passed in the gulp command*. All the approriate folders are moved from the Frontend Plugins repo to the base template. Gulp also writes to a number of files in base template to point to the new plugin. Once the plugin is fully installed the Frontend Plugin repo is removed from the base template. 

The following are necessary to run the task:

* Ensure you are using a command line platform with git enabled or the whole task will fail
* Replace "example-plugin-name" of the command below with the folder name in Frontend-Plugins of the plugin you want to install e.g. affiliates-list

To run the task run: 
```
gulp download_plugin --plugin example-plugin-name
```

You can run the above task as many times as you want to download plugins. Only one plugin can be downloaded at a time.

Run gulp and your plugin should be installed.

## Sass Lint Rules

This project includes [Sass lint](https://github.com/sasstools/sass-lint) and [Gulp Sass Lint](https://www.npmjs.com/package/gulp-sass-lint) which enforce a set of rules for writing Sass in this project. The rules enforced will either break the Gulp build or display a warning message depending on the level of importance of the rule. It is a developer's duty to ensure a project follows these rules even if only a warning is displayed.

The following are the list of rules that will break the build if not followed:

* **Brace Style:** A Selectors brace should be on te same line as the selector
* **Clean Import Paths:** Sass import paths should not include a leading underscore or the file extension
* **Indentation:** Indentation is set to two spaces. Depending on the code editor being used this can be changed in the editors settings: [VSC](https://stackoverflow.com/questions/29972396/how-to-set-tab-space-style), [Sublime Text](https://stackoverflow.com/questions/9474090/how-do-i-force-sublime-text-to-indent-two-spaces-per-tab)
* **Nesting Depth:** The maximum nesting depth is set to 4.
* **No Empty Rulesets:** Empty Sass blocks are not allowed. Some values must be assigned or the block should be removed.
* **No Invalid Hex:** Any hex code that is not a valid hex code will break the build.
* **No Misspelled Properties:** Any properties that are misspelled will break the build.
* **Property Units:** rem values are enforced for font sizes.
* **Quotes:** Double quotes are enforced.
* **Trailing Semicolon:** All Sass values must be followed with a trailing semi-colon.

The following are the list of rules that will not break the build but will generate a warning if not followed:

* **Attribute Quotes:** All attribute selectors should use quotes i.e. input[type="text"]
* **Empty Args:** All mixins includes and extends that don't need a parameter passed should not have empty brackets. i.e. @include foo instead of @include foo()
* **No Trailing Zero:** If zero isn't necessary throw warning i.e. 0.50rem
* **No Trailing Whitespace:** Remove any unnecessary whitespace to keep file trim
* **One Declaration per Line:** Each declaration in a block should begin on a new line.
* **Single Line per Selector:** Each selector for a block should begin on a new line and be comma separated.
* **Border zero:** For no border overwrites use "none" instead of "0".
* **Max Line Length:** The maximum length of one line of Sass is 140 characters.
* **No Duplicate Properties:** One property can be used per block ie.e margin can't be set twice for the same selector.
* **Zero Unit:** Enforces that zero units will be just zero i.e. "0" and not "0px"