# FMS Templating Conventions


### Dependencies
* Bootstrap [v3.3.7] (Grid, Responsive Utilities)
* Normalize.css [v3.0.3]
* jQuery [v3.2.1]
* JW Player [v8.3.3]


### Summary
For selector naming we follow the Block Element Modifier (BEM) methodology.
It is best to utilize preprocessors to avoid the need to copy and paste. This is apart of the build process (SASS).

We are only utilizing pieces of Bootstrap’s framework. The pieces that we use are the Grid and Responsive Utilities of (v3.3.7) as our front-end responsive framework. Referencing Bootstrap’s documentation below is highly recommended for these pieces.

We also include Normalize.css (v3.0.3) which makes browsers render all elements more consistently and in line with modern standards. It precisely targets only the style attributes that need to be normalized.

- Block Element Modifier (BEM): http://getbem.com/naming/
- Grid Documentation: https://getbootstrap.com/docs/3.3/css/#grid
- Normalize.css Documentation: http://nicolasgallagher.com/about-normalize-css/

## Modularizing
**(This ('Modularizing') will not need to be done by your team but understanding the setup will be helpful for development)**

Each standalone piece of the template will be broken into their own component. This creates modularization within the template system.  Each component then can be switched between templates without conflicts or a heavy setup process.

* Template
    * skeleton.pug - (HTML5 doctype page markup)

    * Module
        * form - (Component type used as name)
	        * CSS - (Shared JS among the same component type)
	        * JS - (Shared JS among the same component type)
	        * 1 - (Unique version number used as name, there will be more than one verison)
		        * skeleton.pug - (The HTML markup of the component)
		        * CSS - (Cascading Style Sheet dependencies for this component's version)
		        * JS - (Javascript dependencies for this component's version)

# GULP

Development Packages
    * gulp-sass: https://www.npmjs.com/package/gulp-sass
    * gulp-concat: https://www.npmjs.com/package/gulp-concat
    * gulp-uglifycss: https://www.npmjs.com/package/gulp-uglifycss
    * gulp-babel: https://www.npmjs.com/package/gulp-babel
    * gulp-livereload: https://www.npmjs.com/package/gulp-livereload


* Run in Terminal `npm install`
* Run in Terminal `gulp watch`

* File Watcher is set on `src` directory
    * After any file change GULP runs build tasks and outputs into a `dist` directory.
* Automate build tasks, whats included
    * Noramlize, Grid, and other SCSS files in the `scss` directory will be:
        * Compiles SCSS into CSS
        * Concatenates into a single file called style.css (call this in your markup)
        * CSS output will be Minified
        * Auto Reload client auto rebuilds

* There are thousands of other plug-ins to help you automate the build process. https://gulpjs.com/

# JS

* Transpiling
   * Utilize Babel for Transpiling

* Name Conventions
    * camelCase for identifier names (variables and functions).
    * Global variables written in UPPERCASE.
    * Constants written in UPPERCASE.

# CSS
* CSS Name Conventions
    * Follow Block Element Modifier methodology. (http://getbem.com/naming/)
    * Use all-lowercase for elements and attributes.
    * Don't leave trailing spaces at the end of a line.
    * DO NOT use element tag selectors. For example (h1-h6, p, form, span), use class names as a selector.


# Image
* Compression
    * File Types
        * PNG  – This will give a higher quality image but a larger file size.
        * JPEG – Quality is adjustable.
        * GIF  – Only uses 256 colors.
    * SrcSet
        * Use srcset attribute where needed.


* Name Conventions
    * The file name should describe the image in natural speaking language.
    * Do not include stop words.
    * Hyphens to separate words.
    * Only use lowercase.
    * Do not use symbols or punctuation in file names.
    * Only use periods for extensions.


# Font
* It is recommended to use Google Fonts but not restricted to this. https://fonts.google.com/


# Video
* We use Embedded JW Player. https://developer.jwplayer.com/
