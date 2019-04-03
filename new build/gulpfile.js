const SETTINGS     = require('./gulp-settings.js')
const GULP         = require('gulp')
const SASS         = require('gulp-sass')
const CONCAT       = require('gulp-concat')
const mqpacker = require('css-mqpacker');
const perfectionist = require('perfectionist');
// const UGLIFYCSS    = require('gulp-uglifycss')
const BABEL        = require('gulp-babel')
const NOTIFY       = require('gulp-notify')
const PLUMBER      = require('gulp-plumber')
const BROWSER_SYNC = require('browser-sync').create()
const SOURCEMAPS   = require('gulp-sourcemaps')
const POSTCSS      = require('gulp-postcss')
const AUTOPREFIXER = require('autoprefixer')
const CLEAN        = require('del')
const IMAGEMIN     = require('gulp-imagemin')
const WAIT         = require('gulp-wait')
const CACHE        = require('gulp-cache')
const responsive = require('gulp-responsive');

const fs = require('fs');


function getFolders() {
    return fs.readdirSync(SETTINGS.src.root)
        .filter(function(file) {
            if (file.includes(SETTINGS.folderPreffix)) {
                return file;
            }
        });
}

function handleError(error) {
    this.emit('end')
}

const POSTCSS_PLUGINS = [
    AUTOPREFIXER({
        cascade: false,
        browsers: ['last 2 versions', 'IE 11'],
    })
]

const POSTCSS_PLUGINS_DEV = [
    AUTOPREFIXER({
        cascade: false,
        browsers: ['last 2 versions', 'IE 11'],
      }),
    mqpacker({
        sort: true,
    }),
    perfectionist({
      cascade: false,
      colorShorthand: false,
      indentSize: 2,
      maxSelectorLength: false,
      maxAtRuleLength: false,
      maxValueLength: false,
    })
]

function server(done) {
    BROWSER_SYNC.init({
        server: {
            baseDir: SETTINGS.dist.root,
            directory: true,
            reloadOnRestart: true
        },
        port: 3010
    })
    done();
}

// function img_resize(done) {
//     compileAssets(function(folder) {
//         return GULP.src(`${SETTINGS.src.img}**/*.+(png|jpg)`)
//             .pipe(PLUMBER({errorHandler: NOTIFY.onError('Error: <%= error.message %>')}))
//             .pipe(WAIT(500))
//             .pipe(responsive({
//                 '*': [{
//                     rename: { suffix: '' },
//                 },{
//                     width: 768,
//                     rename: { suffix: '-768w' },
//                 }, {
//                     width: 992,
//                     rename: { suffix: '-992w' },
//                 }, {
//                     width: 1200,
//                     rename: { suffix: '-1200w' },
//                 }, {
//                     width: '200%',
//                     rename: { suffix: '@2x' },
//                 }, {
//                     width: '300%',
//                     rename: { suffix: '@3x' },
//                 }],
//             }, {
//                 withoutEnlargement: false,
//                 // errorOnEnlargement: false,
//                 errorOnUnusedImage: false,
//                 errorOnUnusedConfig: false,
//             }))
//             .pipe(GULP.dest(`${SETTINGS.dist.root}/${folder}/${SETTINGS.dist.img}`))
//     });
// }

function img(done) {
    compileAssets(function(folder) {
        return GULP.src(`${SETTINGS.src.img}/**/*.+(png|jpg)`)
            .pipe(PLUMBER({errorHandler: NOTIFY.onError('Error: <%= error.message %>')}))
            .pipe(WAIT(500))
            .pipe(responsive({
                '*': [{
                    rename: { suffix: '' },
                },{
                    width: 768,
                    rename: { suffix: '-768w' },
                }, {
                    width: 992,
                    rename: { suffix: '-992w' },
                }, {
                    width: 1200,
                    rename: { suffix: '-1200w' },
                }, {
                    width: '200%',
                    rename: { suffix: '@2x' },
                }, {
                    width: '300%',
                    rename: { suffix: '@3x' },
                }],
            }, {
                withoutEnlargement: false,
                // errorOnEnlargement: false,
                errorOnUnusedImage: false,
                errorOnUnusedConfig: false,
            }))
            .pipe(CACHE(IMAGEMIN()))
            .pipe(GULP.dest(`${SETTINGS.dist.root}${folder}/${SETTINGS.dist.img}`), done())
    });
    
}

function compileAssets(callback) {
    var folders = getFolders();

    if (!folders.length) return done();

    folders.map(folder => {
        if (typeof(callback) === 'function') {
            return callback(folder);
        }
        return folder;
    })
}

function sass_dev(done) {
    compileAssets(function(folder) {
        return GULP.src([
            `${SETTINGS.src.scss}**/*.{scss,sass}`
            ])
        .pipe(PLUMBER({errorHandler: NOTIFY.onError('Error: <%= error.message %>')}))
        .pipe(WAIT(500))
        .pipe(SOURCEMAPS.init())
        .pipe(SASS({outputStyle: 'expanded'}))
        .pipe(POSTCSS(POSTCSS_PLUGINS_DEV))
        .pipe(CONCAT('style.css'))
        .pipe(SOURCEMAPS.write('./'))
        .pipe(GULP.dest(`${SETTINGS.dist.root}/${folder}/${SETTINGS.dist.css}`), done())
    });
}

function sass_devUnique(done) {
    compileAssets(function(folder) {
        return GULP.src([
            `${SETTINGS.src.root}${folder}/scss/*.{scss,sass}`,
            ])
        .pipe(PLUMBER({errorHandler: NOTIFY.onError('Error: <%= error.message %>')}))
        .pipe(WAIT(500))
        .pipe(SOURCEMAPS.init())
        .pipe(SASS({outputStyle: 'expanded'}))
        .pipe(POSTCSS(POSTCSS_PLUGINS_DEV))
        .pipe(CONCAT('page.css'))
        .pipe(SOURCEMAPS.write('./'))
        .pipe(GULP.dest(`${SETTINGS.dist.root}/${folder}/${SETTINGS.dist.css}`), done())
    });
}

function sass_dist(done) {
    compileAssets(function(folder) {
        return GULP.src([
            `${SETTINGS.src.scss}**/*.{scss,sass}`
            ])
        .pipe(PLUMBER({errorHandler: NOTIFY.onError('Error: <%= error.message %>')}))
        .pipe(CONCAT('style.css'))
        .pipe(SASS({outputStyle: 'compressed'}))
        .pipe(POSTCSS(POSTCSS_PLUGINS))
        .pipe(GULP.dest(`${SETTINGS.dist.root}/${folder}/${SETTINGS.dist.css}`), done());
    });
}

function sass_distUnique(done) {
    compileAssets(function(folder) {
        return GULP.src([
            `${SETTINGS.src.root}${folder}/scss/*.{scss,sass}`,
            ])
        .pipe(PLUMBER({errorHandler: NOTIFY.onError('Error: <%= error.message %>')}))
        .pipe(CONCAT('page.css'))
        .pipe(SASS({outputStyle: 'compressed'}))
        .pipe(POSTCSS(POSTCSS_PLUGINS))
        .pipe(GULP.dest(`${SETTINGS.dist.root}/${folder}/${SETTINGS.dist.css}`), done());

    });
}

function build_js(done) {
    compileAssets(function(folder) {
        return GULP.src([
                `${SETTINGS.src.js}**/*.js`
            ])
            .pipe(BABEL({
                plugins: ['@babel/transform-runtime']
            }))
            .pipe(PLUMBER({errorHandler: NOTIFY.onError('Error: <%= error.message %>')}))
            .pipe(GULP.dest(`${SETTINGS.dist.root}/${folder}/${SETTINGS.dist.js}`), done())
    });
   
}

function build_jsUnique(done) {
    compileAssets(function(folder) {
        return GULP.src([
                `${SETTINGS.src.root}${folder}/js/**/*.js`
            ])
            .pipe(BABEL({
                plugins: ['@babel/transform-runtime']
            }))
            .pipe(PLUMBER({errorHandler: NOTIFY.onError('Error: <%= error.message %>')}))
            .pipe(GULP.dest(`${SETTINGS.dist.root}/${folder}/${SETTINGS.dist.js}`), done())
    });
   
}

function fonts(done) {
    compileAssets(function(folder) {
        return GULP.src(`${SETTINGS.src.fonts}/**/*`)
            .pipe(PLUMBER({errorHandler: NOTIFY.onError('Error: <%= error.message %>')}))
            .pipe(GULP.dest(`${SETTINGS.dist.root}/${folder}/${SETTINGS.dist.fonts}`), done())
    });
    
}

function html(done) {
    return GULP.src(`${SETTINGS.src.root}/**/*.html`)
    .pipe(PLUMBER({errorHandler: NOTIFY.onError('Error: <%= error.message %>')}))
    .pipe(GULP.dest(`${SETTINGS.dist.root}`), done())
}

function clean(done) {
    CLEAN.sync(`${SETTINGS.dist.root}`);
    done();
}

function browserSyncReload(done) {
    BROWSER_SYNC.reload();
}

function watchFiles() {
    GULP.watch(
       [`${SETTINGS.src.scss}/**/*.{scss,sass}`],
        GULP.series(sass_dev)
    ).on('change', browserSyncReload)
    GULP.watch(
       [`${SETTINGS.src.root}**/scss/**/**/*.{scss,sass}`],
        GULP.series(sass_devUnique)
    ).on('change', browserSyncReload)
    GULP.watch(
       [`${SETTINGS.src.root}*.html`, `${SETTINGS.src.root}**/*.html`], 
       GULP.series(html)
    ).on('change', browserSyncReload)
    GULP.watch(
       [`${SETTINGS.src.js}**/*.js`], 
       GULP.series(build_js)
    ).on('change', browserSyncReload)
    GULP.watch(
       [`${SETTINGS.src.root}**/js/**/*.js`], 
       GULP.series(build_jsUnique)
    ).on('change', browserSyncReload)
    GULP.watch(`${SETTINGS.src.fonts}**/*.*`,
       GULP.series(fonts)
    ).on('change',  browserSyncReload)
    GULP.watch(`${SETTINGS.src.img}**/*.+(png|jpg|gif|svg)`, 
       GULP.series(img)
    ).on('change',  browserSyncReload)
}

const production = GULP.series(clean, GULP.series(GULP.parallel(sass_dist, sass_distUnique), html, img, GULP.parallel(build_js, build_jsUnique), fonts));
const dist = GULP.series(clean, GULP.series(GULP.parallel(sass_dist, sass_distUnique), html, img, GULP.parallel(build_js, build_jsUnique), fonts));
const watch = GULP.parallel(server, watchFiles);
const dev = GULP.series(clean, GULP.series(GULP.parallel(sass_dev, sass_devUnique), GULP.parallel(build_js, build_jsUnique), html, img, fonts), watch);

exports.production = production;
exports.dist = dist;
exports.watch = watch;
exports.default = dev;
