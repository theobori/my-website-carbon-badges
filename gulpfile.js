var gulp = require('gulp'),
    terser = require('gulp-terser'),
    replace = require('gulp-replace'),
    postcss = require('gulp-postcss'),
    cssnano = require('cssnano'),
    rename = require('gulp-rename'),
    fs = require('fs'),
    markdown = require('gulp-markdown-github-style');

function scripts() {
    return gulp
        .src('./src/b.js')
        .pipe(replace('{{css}}', function(s) {
            var style = fs.readFileSync('./public/b.min.css', 'utf8');
            return '<style>' + style + '</style>';
        }))
        .pipe(replace('{{default_url}}', function(s) {
            return process.env.DEFAULT_URL || 'https://theobori.cafe/';
        }))
        .pipe(terser())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('./public'));
}

function styles() {
    return gulp.src('./src/b.css')
        .pipe(postcss([
            // autoprefixer(),
            cssnano()
        ]))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('./public'));
}

function readme() {
    return gulp.src('README.md')
        .pipe(gulp.dest('./public'))
        .pipe(markdown())
        .pipe(replace('./public/badge', function(s) {
            return './badge';
        }))
        .pipe(rename('index.html'))
        .pipe(gulp.dest('./public'));
}

function watchFiles() {
    gulp.watch(['./src/*'],
    gulp.series(readme, styles, scripts));
}

gulp.task('default', gulp.series(readme, styles, scripts));
gulp.task('watch', watchFiles);

exports.styles = styles
exports.scripts = scripts
