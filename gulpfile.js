const SETTINGS     = require('./gulp-settings.js')
const GULP         = require('gulp')
const SASS         = require('gulp-sass')(require('sass'))
const CONCAT       = require('gulp-concat')
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

const POSTCSS_PLUGINS = [
	AUTOPREFIXER()
]

// Individual tasks
// ----------------------------------------------------

GULP.task('sass:dev', function() {
	return GULP.src(SETTINGS.src.scss + '**/*.+(scss|sass)')
		.pipe(PLUMBER({errorHandler: NOTIFY.onError('Error: <%= error.message %>')}))
		.pipe(WAIT(500))
		.pipe(SOURCEMAPS.init())
		.pipe(SASS({outputStyle: 'compressed'}))
		.pipe(POSTCSS(POSTCSS_PLUGINS))
		.pipe(SOURCEMAPS.write())
		.pipe(CONCAT('style.css'))
		.pipe(GULP.dest('./' + SETTINGS.dist.css))
		.pipe(BROWSER_SYNC.reload({stream: true}))
})

GULP.task('sass:dist', function() {
	return GULP.src(SETTINGS.src.scss + '**/*.+(scss|sass)')
		.pipe(PLUMBER({errorHandler: NOTIFY.onError('Error: <%= error.message %>')}))
		.pipe(SASS({outputStyle: 'compressed'}))
		.pipe(POSTCSS(POSTCSS_PLUGINS))
		.pipe(CONCAT('style.css'))
		.pipe(GULP.dest('./' + SETTINGS.dist.css))
})

GULP.task('build-js', function() {
	return GULP.src('src/js/*')
		.pipe(BABEL({
			plugins: ['@babel/transform-runtime']
		}))
		.on('error', function handleError(error) {
            console.log(error.toString())
            this.emit('end')
        })
		.pipe(GULP.dest('./' + SETTINGS.dist.js))
})

GULP.task('img', function() {
	return GULP.src(SETTINGS.src.img + '**/*.+(png|jpg|gif|svg)')
		.pipe(PLUMBER({errorHandler: NOTIFY.onError('Error: <%= error.message %>')}))
		.pipe(WAIT(500))
		.pipe(CACHE(IMAGEMIN()))
		.pipe(GULP.dest('./' + SETTINGS.dist.img))
})

GULP.task('fonts', function() {
	return GULP.src(SETTINGS.src.fonts + '**/*.*')
		.pipe(PLUMBER({errorHandler: NOTIFY.onError('Error: <%= error.message %>')}))
		.pipe(GULP.dest('./' + SETTINGS.dist.fonts))
})

GULP.task('html', function() {
	return GULP.src(SETTINGS.src.root + '**/*.html')
		.pipe(PLUMBER({errorHandler: NOTIFY.onError('Error: <%= error.message %>')}))
		.pipe(GULP.dest('./' + SETTINGS.dist.root))
})

GULP.task('clean', async function() {
	return CLEAN.sync('./' + SETTINGS.dist.root)
})

// ----------------------------------------------------

// Watch
GULP.task('watch', GULP.parallel(
    watchCss  = () => { GULP.watch('./' + SETTINGS.src.scss + '**/*.+(scss|sass)', GULP.series('sass:dev')) },
    watchHtml = () => { GULP.watch('./' + SETTINGS.src.root + '**/*.html', GULP.series('html')).on('change', BROWSER_SYNC.reload) },
    watchJs   = () => { GULP.watch('./' + SETTINGS.src.js + '**/*.*', GULP.series('build-js')).on('change', BROWSER_SYNC.reload) },
    watchFont = () => { GULP.watch('./' + SETTINGS.src.fonts + '**/*.*', GULP.series('fonts')).on('change', BROWSER_SYNC.reload) },
    watchImg  = () => { GULP.watch('./' + SETTINGS.src.img + '**/*.+(png|jpg|gif|svg)', GULP.series('img')) }
))

// Local server for dist root
GULP.task('server', async function() {
	BROWSER_SYNC.init({
		server: {
			baseDir: './' + SETTINGS.dist.root,
			port: 3010,
			directory: true,
			reloadOnRestart: true
		}
	})
})

// Main series tasks
// ----------------------------------------------------

GULP.task('dist', GULP.series('clean', 'sass:dist', 'build-js', 'img', 'html', 'fonts'))

GULP.task('dev', GULP.series('dist', 'server', 'watch'))
