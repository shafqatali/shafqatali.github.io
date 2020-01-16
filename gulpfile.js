/*
* gulp guide https://medium.com/@boriscoder/catching-errors-on-gulp-js-4682eee2669f
*
*/
//set to true if you want to play a sound on error/success
let processCompleteSound = true;
let processErrorSound = true;
//set exportThemeFiles to true if you want to export theme files to CMS theme folder
let exportThemeFiles = false;
//Please make sure that you have update the path according to your folder structure
let kentico_theme_folder = "CMS/App_Themes/Custom";
//Please set the PORT where you want to run it, by default it will generate random number between 0 to 8000
let ServerPort = 51870;//Math.floor(Math.random() * 8000);
// Include paths file.
let paths = require('./gulp_config/paths');

let css_files_to_gulp = paths.gulpedCssNames;
let js_es6_files_to_gulp = paths.gulpedJsNames;
let js_files_to_gulp = paths.gulpedJsNames.map(obj => {
    return obj.replace(".js", ".parsed.js")
});
let js_libraries_to_gulp = paths.gulpedJsLibraries;

let sass_root_name = "**/*.scss";  //.min will be appended to output file name by default i.e gulp_default.min.css
let sass_destination_folder = "_scss";

let css_gulped_name = "gulp_default.css";  //.min will be appended to output file name by default i.e gulp_default.min.css
let css_destination_folder = "css";

let js_libraries_name = 'gp_libraries.js';
let js_files_name = 'gp_files.js';
let js_files_es6 = 'gp_files_es6.js';
let js_gulped_name = 'gulp_script.js'; //.min.uglify will be appended to output file name by default i.e gulp_script.min.uglify.js
let js_gulped_es6_name = 'gulp_script_es6.js'; //.min.uglify will be appended to output file name by default i.e gulp_script.min.uglify.js
let js_destination_folder = "js";


let startWatching = false;

let gulp = require('gulp');
let concat = require('gulp-concat');
let sass = require('gulp-sass');
let minifyCss = require('gulp-clean-css');
let rename = require('gulp-rename');
//let uglify = require('gulp-uglify');
let uglify = require('gulp-uglifyes');
let terser = require('gulp-terser');
let del = require('delete');
let rimraf = require('gulp-rimraf');
let run = require('gulp-run');
let runSequence = require('run-sequence');
let sourcemaps = require('gulp-sourcemaps');
let browserSync = require('browser-sync').create();
let sassLint = require('gulp-sass-lint');
let babel = require('gulp-babel');
let fs = require('fs');
let LineByLineReader = require('line-by-line');

let libManJson = require('./libman.json');
let execSync = require('sync-exec');


//plugin dependencies
let git = require('gulp-git');
let sequence = require('gulp-sequence');
let replace = require('gulp-string-replace');
let merge = require('merge-stream');
let footer = require('gulp-footer');
let glob = require('glob');
let copy = require('directory-copy');
let makeDir = require('make-dir');
let gulpif = require('gulp-if');
let download = require("gulp-download");
let checkFilesExist = require('check-files-exist');
let isOnline = require('is-online');

//computed variables
let site_dir = '_site';
let sass_gulp_path = sass_destination_folder + '/' + sass_root_name;
let css_gulp_path = css_destination_folder + '/' + css_gulped_name;
let js_gulp_path = js_destination_folder + '/' + js_gulped_name;
let js_gulp_path_babel = js_destination_folder + '/' + js_gulped_es6_name;

let js_path = js_destination_folder + '/';
//eslint
const {src, task} = require('gulp');
const eslint = require('gulp-eslint');

gulp.task('downloadVueFiles', function () {

    isOnline().then(online => {
        if (online) {
            console.log("You have working internet connection");

            checkFilesExist(['js/vue.js', 'js/vue.min.js'], __dirname).then(function () {
                console.log('Vue files already exists.');
            }, function () {
                console.log("No Vue Files exists in your directory, gulp task will download now!");

                return download([
                    'https://vuejs.org/js/vue.js',
                    'https://vuejs.org/js/vue.min.js'
                ]).pipe(gulp.dest(js_path));
            });
        } else {
            console.log("You have no working internet connection");
        }
    });
});

gulp.task('es_lint', function (callback) {
    //remove the following files from lint parsing
    let jsFiles = ['js/**/*.js', '!js/**/*.min.js', '!js/analytics.js', '!js/ga.js', '!js/gtm.js', '!js/gulp_script*.js',
        '!js/popper.js', '!js/**/shuffle.js', '!js/**/pep.js', '!js/**/easyListSplitter.js',
        '!js/**/jquery.elastislide.js', '!js/**/twitter-post-fetcher.js', '!js/**/jquery.easing.1.3.js', '!js/**/gallery*.js',
        '!js/**/ajax-service.js',
        '!js/vue.js',
        '!js/gp_*.js', '!js/gulp_*.js', '!js/oil-js/**/*', '!js/**/*.parsed.js'];
    return src(jsFiles)
    // eslint() attaches the lint output to the "eslint" property
    // of the file object so it can be used by other modules.
        .pipe(eslint({fix: true}))
        // eslint.format() outputs the lint results to the console.
        // Alternatively use eslint.formatEach() (see Docs).
        .pipe(eslint.format())
        // To have the process exit with an error code (1) on
        // lint error, return the stream and pipe to failAfterError last.
        .pipe(eslint.failAfterError());
});


/*#region Js Gulp Items*/
gulp.task('process_js', function (callback) {
    runSequence(
        'es_lint',
        'parse_with_babel',
        'concat_js_libraries',
        'concat_js_files',
        'merge_js_files',
        'uglify_js_files',
        //'concat_normal_js_files',
        //'merge_normal_js_files',
        //'uglify_normal_js_files',
        'delete_working_js_files',
        'copy_js_files',
        callback);
});

gulp.task('concat_js_libraries', function () {
// add all the JS file names that you want to include in gulp,
    return gulp.src(js_libraries_to_gulp)
        .pipe(concat(js_libraries_name))
        .pipe(gulp.dest(js_destination_folder));
});

gulp.task('concat_js_files', function () {
// add all the JS file names that you want to include in gulp,
    return gulp.src(js_files_to_gulp)
        .pipe(concat(js_files_name))
        .pipe(gulp.dest(js_destination_folder))
        .on('end', function(){ });
});

gulp.task('concat_normal_js_files', function () {
// add all the JS file names that you want to include in gulp,
    return gulp.src(js_es6_files_to_gulp)
        .pipe(concat(js_files_es6))
        .pipe(gulp.dest(js_destination_folder))
        .on('end', function(){ });
});

gulp.task('parse_with_babel', function () {
    return js_es6_files_to_gulp.map(function (element) {
        gulp.src(element)
            .pipe(babel({
                "presets": ["@babel/preset-env"]
            }))
            .pipe(rename({suffix: '.parsed'}))
            .pipe(gulp.dest(function (file) {
                return file.base;
            }));
    });
});

gulp.task('merge_js_files', function () {
// add all the JS file names that you want to include in gulp,
    let mergeFiles = [js_path + js_libraries_name, js_path + js_files_name];
    return gulp.src(mergeFiles)
        .pipe(concat(js_gulped_name))
        .pipe(gulp.dest(js_destination_folder));
});

gulp.task('uglify_js_files', function () {
    return gulp.src(js_destination_folder + "/" + js_gulped_name)
        .pipe(terser())
        .pipe(rename({suffix: '.min.uglify'}))
        .pipe(gulp.dest(js_destination_folder))
        .pipe(gulp.dest(site_dir + '/' + js_destination_folder))
        .pipe(gulpif(exportThemeFiles, gulp.dest(kentico_theme_folder + '/' + js_destination_folder)));
});

gulp.task('merge_normal_js_files', function () {
// add all the JS file names that you want to include in gulp,
    let mergeFiles = [js_path + js_libraries_name, js_path + js_files_es6];
    return gulp.src(mergeFiles)
        .pipe(concat(js_gulped_es6_name))
        .pipe(gulp.dest(js_destination_folder));
});

gulp.task('uglify_normal_js_files', function () {
    return gulp.src(js_destination_folder + "/" + js_gulped_es6_name)
        .pipe(terser())
        .pipe(rename({suffix: '.min.uglify'}))
        .pipe(gulp.dest(js_destination_folder))
        .pipe(gulp.dest(site_dir + '/' + js_destination_folder))
        .pipe(gulpif(exportThemeFiles, gulp.dest(kentico_theme_folder + '/' + js_destination_folder)));
});

gulp.task('delete_working_js_files', function () {
    del.sync(js_gulp_path, {force: true});
    del.sync(js_gulp_path_babel, {force: true});
    del.sync(site_dir + '/' + js_gulp_path, {force: true});
    del.sync(site_dir + '/' + js_gulp_path_babel, {force: true});
    del.sync(js_path + "gp_*.js", {force: true});
    del.sync(site_dir + js_path + "gp_*.js", {force: true});
});

gulp.task('copy_js_files', function () {
    copy({src: 'js', dest: site_dir + '/js'}, function () {
        console.log("\x1b[43m%s\x1b[0m", 'JS files copied to _site!');

    });

    if (exportThemeFiles) {
        copy({src: 'js', dest: kentico_theme_folder + '/js'}, function () {
            console.log("\x1b[43m%s\x1b[0m", 'JS files copied to kentico theme!');
        });
    }
    if (startWatching && processCompleteSound) {
        console.log("\007");
    }
});
/*#endregion*/

/*#region CSS Gulp Items*/

gulp.task('process_css', ['create_folders_in_kentico'], function (callback) {
    runSequence(
        'compile_sass_files',
        'compile_sass_files_style_guide',
        'delete_presentation_css_from_kentico',
        'concat_css_files',
        'css_minify',
        'delete_working_css_files',
        callback);
});

gulp.task('compile_sass_files', function () {
    return gulp.src(sass_gulp_path)
        .pipe(sassLint({options: {'config-file': '.sass-lint.yml'}}))
        .pipe(sassLint.format()).on('error', function () {
            error_alert('Sass lint format error');
        })
        .pipe(sassLint.failOnError()).on('error', function () {
            error_alert('An error in compile scss');
        })
        .pipe(sourcemaps.init())
        .pipe(sass({
            style: 'compressed',
            trace: true,
            loadPath: [sass_destination_folder]
        }))
        .pipe(sourcemaps.write(''))
        .pipe(gulp.dest(site_dir + '/css'))
        .pipe(gulp.dest('css'))
        .pipe(gulpif(exportThemeFiles, gulp.dest(kentico_theme_folder + '/css')))
        .pipe(browserSync.stream());
});

gulp.task('compile_sass_files_style_guide', function () {
    return gulp.src("_styleguide-specifics/patterns.scss")
        .pipe(sass({
            style: 'compressed',
            trace: true,
            loadPath: [sass_destination_folder]
        }))
        .pipe(gulp.dest('css'))
        .pipe(gulp.dest(site_dir + '/css'))
        .pipe(browserSync.stream());
});

gulp.task('concat_css_files', function () {
    // concat all the files into a single file,
    return gulp.src(css_files_to_gulp)
        .pipe(concat(css_gulped_name))
        .pipe(gulp.dest(css_destination_folder));
});

gulp.task('css_minify', function () {
    //minify the single css file
    return gulp.src(css_gulp_path)
        .pipe(minifyCss({compatibility: 'ie9'}))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(css_destination_folder))
        .pipe(gulpif(exportThemeFiles, gulp.dest(kentico_theme_folder + '/css')));
});

gulp.task('delete_working_css_files', function () {
    //delete files
    del.sync(css_gulp_path, {force: true});
    del.sync(site_dir + '/' + css_gulp_path, {force: true});
});

/*#endregion*/

gulp.task('gulp_js_watch', ['process_js'], function (callback) {
    browserSync.reload();
    callback();
});

gulp.task('gulp_dump_jekyll', function () {
    //del.sync(site_dir + '/gulpfile.js', {force: true});
});

gulp.task('gulp_build_jekyll', function () {
    let shellCommand = 'jekyll build -q';

    return gulp.src('')
        .pipe(run(shellCommand));
});

gulp.task('gulp_delete_jekyll', function (callback) {
    del(site_dir,{force: true});
    callback();
});

gulp.task('build_jekyll', function (callback) {
    runSequence(
        //'downloadVueFiles',
        'gulp_libman_restore',
        'read_file_lines',
        'gulp_delete_jekyll',
        'process_js',
        'process_css',
        'copy_to_kentico',
        'delete_presentation_css_from_kentico',
        'gulp_build_jekyll',
        'gulp_dump_jekyll',
        callback);
});

gulp.task('gulp_build_jekyll_watch', ['gulp_delete_jekyll', 'gulp_build_jekyll', 'gulp_dump_jekyll'], function (callback) {
    browserSync.reload();
    callback();
});

//run on Jekyll project
gulp.task('default', ['build_jekyll'], function () {
    browserSync.init({
        server: site_dir + '/',
        ghostMode: false, // Toggle to mirror clicks, reloads etc. (performance)
        logFileChanges: true,
        logLevel: 'debug',
        port: ServerPort,
        open: true        // Toggle to automatically open page when starting.
    });

    // Watch .scss files; changes are piped to browserSync.
    gulp.watch(['_scss/**/*.scss', '_styleguide-specifics/**/*.scss'], {interval: 500}, ['process_css', function (callback) {
        ShowMessage(), callback
    }]);
    gulp.watch('_bootstrap-sass/scss/_custom.scss', {interval: 500}, ['process_css', function (callback) {
        ShowMessage(), callback
    }]);

    gulp.watch('_scss/_variables.scss', {interval: 500}, ['read_file_lines', function (callback) {
        ShowMessage(), callback
    }]);

    // Watch .js files.
    gulp.watch(['js/**/*.js', '!js/gp_*.js', '!js/gulp_*.js', '!js/**/*.parsed.js',], {interval: 500}, ['gulp_js_watch', function (callback) {
        ShowMessage(), callback
    }]);

    // Watch html and markdown files.
    gulp.watch(['sw.js','**/*.+(html|md|markdown|MD|yml|svg|png|jpg|jpeg|rb|gif|txt)', '!_site/**/*.*'], {interval: 500}, ['gulp_build_jekyll_watch', function (callback) {
        ShowMessage(), callback
    }]);
    startWatching = true;
});

gulp.task('read_file_lines', function (callback) {
    let baseColorLines = [];
    let greyColorLines = [];
    let pluginsColorLines = [];
    lr = new LineByLineReader('_scss/_variables.scss');

    lr.on('error', function (err) {
        // 'err' contains error object
        callback();
    });
    let countVariables = false;
    lr.on('line', function (line) {
        // 'line' contains the current line without the trailing newline character.
        if (line.startsWith('//BaseColorsStatsHere') === true) {
            countVariables = true;
        }
        if (line.startsWith('//BaseColorsEndsHere') === true) {
            countVariables = false;
        }
        if (countVariables) {
            if (line.length > 0 && line.startsWith('//') === false && line.indexOf('//skip') === -1 && (line.indexOf('#') > 0 || line.indexOf('rgb') > 0)) {
                baseColorLines.push(line);
            }
        }
    });

    let countGreyVariables = false;
    lr.on('line', function (line) {
        // 'line' contains the current line without the trailing newline character.
        if (line.startsWith('//GreyColorsStartsHere') === true) {
            countGreyVariables = true;
        }
        if (line.startsWith('//GreyColorsEndsHere') === true) {
            countGreyVariables = false;
        }
        if (countGreyVariables) {
            if (line.length > 0 && line.startsWith('//') === false && line.indexOf('//skip') === -1 && (line.indexOf('#') > 0 || line.indexOf('rgb') > 0)) {
                greyColorLines.push(line);
            }
        }
    });

    let countPluginsVariables = false;
    lr.on('line', function (line) {
        // 'line' contains the current line without the trailing newline character.
        if (line.startsWith('//PluginsColorsStartsHere') === true) {
            countPluginsVariables = true;
        }
        if (line.startsWith('//PluginsColorsEndsHere') === true) {
            countPluginsVariables = false;
        }
        if (countPluginsVariables) {
            if (line.length > 0 && line.startsWith('//') === false && line.indexOf('//skip') === -1 && (line.indexOf('#') > 0 || line.indexOf('rgb') > 0)) {
                pluginsColorLines.push(line);
            }
        }
    });

    lr.on('end', function () {
        // All lines are read, file is closed now.
        let markup = baseColorLines.map(line => {
            if (line.length > 0) {
                //remove last semicolon adn everything after that
                let parts = line.replace(/\;.*/, '').split(':');
                const itemMarkup = `<li>
    <span class="circle" style="background-color: ${parts[1]};"></span>
    <span class="color-name">${parts[0]}</span>
    <span class="color-code">HEX: ${parts[1]}</span>
</li>
`;
                return itemMarkup;
            } else {
                return '';
            }
        }).join('');

        let markupGreyColors = greyColorLines.map(line => {
            if (line.length > 0) {
                //remove last semicolon adn everything after that
                let parts = line.replace(/\;.*/, '').split(':');
                const itemMarkup = `<li>
    <span class="circle" style="background-color: ${parts[1]};"></span>
    <span class="color-name">${parts[0]}</span>
    <span class="color-code">HEX: ${parts[1]}</span>
</li>
`;
                return itemMarkup;
            } else {
                return '';
            }
        }).join('');

        let markupPluginsColors = pluginsColorLines.map(line => {
            if (line.length > 0) {
                //remove last semicolon adn everything after that
                let parts = line.replace(/\;.*/, '').split(':');
                const itemMarkup = `<li>
    <span class="circle" style="background-color: ${parts[1]};"></span>
    <span class="color-name">${parts[0]}</span>
    <span class="color-code">HEX: ${parts[1]}</span>
</li>
`;
                return itemMarkup;
            } else {
                return '';
            }
        }).join('');

        let color_palette_markup = `
<!--color palette markup start-->
<h4 class="ds-sub-title">Brand colours</h4>
<div class="ds-notes">The following is a list of all brand colours used in the design. Brand colours are used in meaningful and intentional ways.</div>
<div class="container no-gutters ds-elements">
<ul class="ds-color-palette">
${markup}
</ul>
</div>
<h4 class="ds-sub-title">Greys</h4>
<div class="ds-notes">The Greyscale palette can be used for non-interactive text and background interface elements.</div>
<div class="container no-gutters ds-elements">
<ul class="ds-color-palette">
${markupGreyColors}
</ul>
</div>
<h4 class="ds-sub-title">Plugins Colours</h4>
<div class="container no-gutters ds-elements">
<ul class="ds-color-palette">
${markupPluginsColors}
</ul>
</div>`;

        //now read and replace in files
        writeMarkupToFile('_00-atoms/01-global/00-colors.html', color_palette_markup, callback);
    });
});

function writeMarkupToFile(fullName, color_palette_markup, callback) {
    //read the file and update it's content
    //the color palette markup will be in between HTML markup comment lines
    let file_markup = '';
    let appendLines = true;
    let addMarkupNow = false;
    file = new LineByLineReader(fullName);
    file.on('error', function (err) {
        // 'err' contains error object
        callback();
    });
    file.on('line', function (line) {
        if (line.indexOf('color palette markup start') > 0) {
            appendLines = false;
            addMarkupNow = true;
        } else if (line.indexOf('color palette markup end') > 0) {
            appendLines = true;
        }

        if (addMarkupNow) {
            file_markup += color_palette_markup + '\n';
            addMarkupNow = false;
        }
        if (appendLines) {
            file_markup += line + '\n';
        }
    });
    file.on('end', function () {
        //write the file and pass control to callback
        fs.writeFile(fullName, file_markup, callback);
    });
}

//download and install plugins
let repo = "Frontend-Plugins";
let plugin;

//clone plugin repo
gulp.task('clone_plugin_repo', function (done) {
    plugin = process.argv[4];
    git.clone('https://github.com/Arekibo/Frontend-Plugins.git', function (err) {
        if (err) {
            done(err);
        }
        done();
    });
});

gulp.task('copy_plugin', ['clone_plugin_repo'], function (done) {
    let folders = ['_data', '_includes', 'css/imgs', 'images', 'js', '_scss', 'gulp_config'];
    let tasks = [];

    for (let i in folders) {
        let folder = folders[i];
        tasks.push(
            gulp.src(repo + '/' + plugin + '/' + folder + '/**/*')
                .pipe(gulp.dest('./' + folder + '/'))
        );
    }
    return merge(tasks);
});

gulp.task('delete_plugin_repo', function () {
    del(repo);
});

gulp.task('write_paths_js', function () {
    return gulp.src('gulp_config/plugins.js')
        .pipe(replace("// '" + plugin + "'", "'" + plugin + "'"))
        .pipe(gulp.dest('./gulp_config/'));
});

gulp.task('write_paths_yaml', function () {
    return gulp.src('_data/plugins.yml')
        .pipe(replace('#- name: "' + plugin + '"', '- name: "' + plugin + '"'))
        .pipe(gulp.dest('./_data/'));
});

gulp.task('write_paths_sass', function () {
    let files = glob.sync('_scss/' + plugin + '/**/*');
    let paths = '';
    for (let i in files) {
        let file = files[i],
            before = file.lastIndexOf('/'),
            beforeRemoved = file.substring(before + 2),
            afterRemoved = beforeRemoved.split('.')[0],
            finalPath = '\n@import "' + plugin + '/' + afterRemoved + '";';
        paths += finalPath;
    }
    return gulp.src('_scss/_plugins.scss')
        .pipe(footer(paths))
        .pipe(gulp.dest('./_scss/'));
});

gulp.task('write_plugin', ['write_paths_js', 'write_paths_yaml', 'write_paths_sass']);

gulp.task('download_plugin', function (done) {
    sequence('copy_plugin', 'write_plugin', 'delete_plugin_repo', done);
});

gulp.task('copy_to_kentico', function () {
    if (exportThemeFiles) {
        copy({src: 'css', dest: kentico_theme_folder + '/css'}, function () {
            console.log("\x1b[43m%s\x1b[0m", 'CSS files copied to kentico theme!');
        });

        copy({src: 'fonts', dest: kentico_theme_folder + '/fonts'}, function () {
            console.log("\x1b[43m%s\x1b[0m", 'Font files copied to kentico theme!');
        });
    }
});

gulp.task('create_folders_in_kentico', function () {
    if (exportThemeFiles) {
        makeDir(kentico_theme_folder + '/css');
        makeDir(kentico_theme_folder + '/fonts');
        makeDir(kentico_theme_folder + '/js');
    }
});

gulp.task('delete_presentation_css_from_kentico', function () {
    if (exportThemeFiles) {
        let list = [kentico_theme_folder + '/css/presentation.css', kentico_theme_folder + '/css/presentation.css.map'];
        del.promise(list, {force: true})
            .then(function (deleted) {
                // deleted files
                //console.log(deleted)
            });
    }
});

function ShowMessage() {
    if (processCompleteSound) {
        console.log("\007");
    }
    let x = new Date();
    let h = x.getHours();
    if (h < 10) h = '0' + h;
    let m = x.getMinutes();
    if (m < 10) m = '0' + m;
    let s = x.getSeconds();
    if (s < 10) s = '0' + s;

    let time = h + ':' + m + ':' + s;
    console.log("\x1b[42m%s\x1b[0m", ">>>>                                                                             <<<<");
    console.log("\x1b[42m%s\x1b[0m", ">>>>                      Recompiled successfully at " + time + "                    <<<<");
    console.log("\x1b[42m%s\x1b[0m", ">>>>                                                                             <<<<");
}

function error_alert(message) {
    if (processErrorSound) {
        setTimeout(function () {
            console.log("\007");
        }, 2000);
        setTimeout(function () {
            console.log("\007");
        }, 3000);
        setTimeout(function () {
            console.log("\007");
        }, 4000);
        setTimeout(function () {
            console.log("\007");
        }, 5000);
    }
    console.log('');
    console.log('');
    console.log("\x1b[41m%s\x1b[0m", "Error occurred: " + message + "");
    console.log('');
    console.log('');
}

/*#region Js Libman Tasks*/
//for libupdate
gulp.task('build_jekyll_libupdate', function (callback) {
    runSequence(
        'gulp_libman_update',
        'read_file_lines',
        'gulp_delete_jekyll',
        'process_js',
        'process_css',
        'copy_to_kentico',
        'delete_presentation_css_from_kentico',
        'gulp_build_jekyll',
        'gulp_dump_jekyll',
        callback);
});

//new for latest fetch
gulp.task('libupdate', ['build_jekyll_libupdate'], function () {
    browserSync.init({
        server: site_dir + '/',
        ghostMode: false, // Toggle to mirror clicks, reloads etc. (performance)
        logFileChanges: true,
        logLevel: 'debug',
        port: ServerPort,
        open: true        // Toggle to automatically open page when starting.
    });


    // Watch .scss files; changes are piped to browserSync.
    gulp.watch(['_scss/**/*.scss', '_pattern-lab-sass/**/*.scss'], {interval: 500}, ['process_css', function (callback) {
        ShowMessage(), callback
    }]);
    gulp.watch('_bootstrap-sass/scss/_custom.scss', {interval: 500}, ['process_css', function (callback) {
        ShowMessage(), callback
    }]);

    gulp.watch('_scss/_variables.scss', {interval: 500}, ['read_file_lines', function (callback) {
        ShowMessage(), callback
    }]);

    // Watch .js files.
    gulp.watch(['js/**/*.js', '!js/gp_*.js', '!js/gulp_*.js', '!js/**/*.parsed.js',], {interval: 500}, ['gulp_js_watch', function (callback) {
        ShowMessage(), callback
    }]);

    // Watch html and markdown files.
    gulp.watch(['**/*.+(html|md|markdown|MD|yml|svg|png|jpg|jpeg|rb|gif|txt)', '!_site/**/*.*'], {interval: 500}, ['gulp_build_jekyll_watch', function (callback) {
        ShowMessage(), callback
    }]);
    startWatching = true;
});

gulp.task('gulp_libman_update', function () {
    execSync('libman restore');
    libManJson.libraries.forEach(function (item) {
        var n = item.library.indexOf('@');
        var libname = item.library.substring(0, n != -1 ? n : item.library.length);
        var shellCommand = 'libman update ' + libname;
        console.log(shellCommand);
        execSync(shellCommand);
    });
});

gulp.task('gulp_libman_restore', function () {
    console.log('Libman Restore Only');
    execSync('libman restore');
});
/*#endregion*/