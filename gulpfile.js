const GULP       = require('gulp')
const SASS       = require('gulp-sass')
const CONCAT     = require('gulp-concat')
const UGLIFYCSS  = require('gulp-uglifycss')
const BABEL      = require('gulp-babel')
const LIVERELOAD = require('gulp-livereload')


function handleError(error) {
    console.log(error.toString())
    this.emit('end')
}

GULP.task('build-css', function () {

    GULP.src('src/scss/*')
        .pipe(SASS({style: 'expanded'}))
        .pipe(CONCAT('style.css'))
        .pipe(UGLIFYCSS({
            "uglyComments": true
        }))
        .on('error', handleError)
        .pipe(GULP.dest('dist/css'))

})

GULP.task('build-js', function () {
    GULP.src('src/js/*')
        .pipe(BABEL({
            plugins: ['@babel/transform-runtime']
        }))
        .on('error', handleError)
        .pipe(GULP.dest('dist/js'))
})

GULP.task('build-img', function () {

    GULP.src('src/img/*')
        .on('error', handleError)
        .pipe(GULP.dest('dist/img'))

})

GULP.task('build-html', function () {

    GULP.src('src/index.html')
        .on('error', handleError)
        .pipe(GULP.dest('dist'))
        .pipe(LIVERELOAD())

})

GULP.task('watch', function () {
    LIVERELOAD.listen()
    GULP.watch('src/**/*', ['build-html','build-img','build-css'])

})