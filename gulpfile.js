const SETTINGS     = require('./gulp-settings.js')
const GULP         = require('gulp')
const SASS         = require('gulp-sass')
const CONCAT       = require('gulp-concat')
const UGLIFYCSS    = require('gulp-uglifycss')
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
const RENAME       = require('gulp-rename')

function handleError(error) {
    console.log(error.toString())
    this.emit('end')
}

const POSTCSS_PLUGINS = [
    AUTOPREFIXER({ browsers: ['last 4 version', 'ie >= 10', 'Android 4'] })
]

//local server
GULP.task('server', function() {
    BROWSER_SYNC.init({
        server: {
            baseDir: './' + SETTINGS.dist.root,
            port: 3010,
            directory: true,
            reloadOnRestart: true
        }
    })
})

GULP.task('sass:dev', function() {
    return GULP.src(SETTINGS.src.scss + '**/*.+(scss|sass)')
        .pipe(PLUMBER({errorHandler: NOTIFY.onError('Error: <%= error.message %>')}))
        .pipe(WAIT(500))
        .pipe(SOURCEMAPS.init())
        .pipe(SASS({outputStyle: 'compressed'}))
        .pipe(POSTCSS(POSTCSS_PLUGINS))
        .pipe(SOURCEMAPS.write())
        .pipe(RENAME(function (path) {
            path.dirname = path.dirname.split('/')[1] + '/' + 'css/'
        }))
        .pipe(GULP.dest('./' + SETTINGS.dist.css))
        .pipe(BROWSER_SYNC.reload({stream: true}))
})

GULP.task('sass:dist', function() {
    return GULP.src(SETTINGS.src.scss + '**/*.+(scss|sass)', {
        base: '.'
    })
        .pipe(PLUMBER({errorHandler: NOTIFY.onError('Error: <%= error.message %>')}))
        .pipe(SASS({outputStyle: 'compressed'}))
        .pipe(POSTCSS(POSTCSS_PLUGINS))
        .pipe(RENAME(function (path) {
            path.dirname = path.dirname.split('/')[1] + '/' + 'css/'
        }))
        .pipe(GULP.dest('./dist'))
})

GULP.task('build-js', function() {
    return GULP.src(SETTINGS.src.js + '**/*.js')
        .pipe(BABEL({
            plugins: ['@babel/transform-runtime']
        }))
        .on('error', handleError)
        .pipe(GULP.dest('./' + SETTINGS.dist.root))
})

GULP.task('img', function() {
    return GULP.src(SETTINGS.src.img + '**/*.+(png|jpg|gif|svg)')
        .pipe(PLUMBER({errorHandler: NOTIFY.onError('Error: <%= error.message %>')}))
        .pipe(WAIT(500))
        .pipe(CACHE(IMAGEMIN()))
        .pipe(GULP.dest('./' + SETTINGS.dist.root))

})

GULP.task('fonts', function() {
    return GULP.src(SETTINGS.src.fonts + '**/*.*')
        .pipe(PLUMBER({errorHandler: NOTIFY.onError('Error: <%= error.message %>')}))
        .pipe(GULP.dest('./' + SETTINGS.dist.root))

})

GULP.task('html', function() {
    return GULP.src(SETTINGS.src.root + '**/*.html')
        .pipe(PLUMBER({errorHandler: NOTIFY.onError('Error: <%= error.message %>')}))
        .pipe(GULP.dest('./' + SETTINGS.dist.root))

})

GULP.task('clean', done => {
    CLEAN.sync('./' + SETTINGS.dist.root)
    return done()
})


GULP.task('dist', GULP.series('clean', 'sass:dist', 'build-js', 'img', 'html', 'fonts'))

GULP.task('watch', GULP.parallel(
    css  = () => { GULP.watch('./' + SETTINGS.src.scss + '**/*.+(scss|sass)', GULP.series('sass:dev')) },
    html = () => { GULP.watch('./' + SETTINGS.src.root + '**/*.html', GULP.series('html')).on('change', BROWSER_SYNC.reload) },
    js   = () => { GULP.watch('./' + SETTINGS.src.js + '**/*.*', GULP.series('build-js')).on('change', BROWSER_SYNC.reload) },
    font = () => { GULP.watch('./' + SETTINGS.src.fonts + '**/*.*', GULP.series('fonts')).on('change', BROWSER_SYNC.reload) },
    img  = () => { GULP.watch('./' + SETTINGS.src.img + '**/*.+(png|jpg|gif|svg)', GULP.series('img')) }
))

GULP.task('dev', GULP.series('dist', 'watch', 'server'))