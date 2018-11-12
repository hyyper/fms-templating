const GULP      = require('gulp')
const SASS      = require('gulp-sass')
const CONCAT    = require('gulp-concat')
const UGLIFYCSS = require('gulp-uglifycss')


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

GULP.task('build-img', function () {

    GULP.src('src/img/*')
        .on('error', handleError)
        .pipe(GULP.dest('dist/img'))

})


GULP.task('build-html', function () {

    GULP.src('src/index.html')
        .on('error', handleError)
        .pipe(GULP.dest('dist'))


})


GULP.task('watch', function () {

    GULP.watch('src/**/*', ['build-html','build-img','build-css'])

})