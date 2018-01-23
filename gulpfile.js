var gulp=require('gulp');
var sass=require('gulp-sass');
var browserSync = require('browser-sync').create();

//Gulp-useref concatenates any number of CSS and JavaScript files into a single file by looking for a comment that starts with "<!--build:" and ends with "<!--endbuild-->"
var useref = require('gulp-useref');

// /use the gulp-uglify plugin to help with minifying JavaScript files. We also need a second plugin called gulp-if to ensure that we only attempt to minify JavaScript files.
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');


//minify the concatenated CSS file as well. We need to use a package called gulp-cssnano plugin to help us with minification.
var cssnano = require('gulp-cssnano');

//minify png, jpg, gif and even svg with the help of gulp-imagemin
var imagemin = require('gulp-imagemin');

//Optimizing images however, is an extremely slow process that you'd not want to repeat unless necessary. To do so, we can use the gulp-cache plugin.
var cache = require('gulp-cache');

//we're generating files automatically, we'll want to make sure that files that are no longer used don't remain anywhere without us knowing.This process is called cleaning (or in simpler terms, deleting files).We'll have to use del to help us with cleaning.
//The del function takes in an array of node globs which tells it what folders to delete.
var del = require('del');

//to ensure that cleans get completed before the rest of the tasks, we need to use an extra plugin called Run Sequence.
var runSequence = require('run-sequence');

gulp.task('hello',function(params) {
    console.log("Hello Gulp");
})

gulp.task('sassToCss',function(){
    return gulp.src('app/scss/**/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({
        stream:true
    }));
});

gulp.task('watch',['browserSync','sassToCss'],function() {
    gulp.watch('app/scss/**/*.scss',['sassToCss']);
    // Reloads the browser whenever HTML or JS files change
  gulp.watch('app/*.html', browserSync.reload); 
  gulp.watch('app/js/**/*.js', browserSync.reload);
});

//we wouldn't be able to write the build task this way because Gulp activates all tasks in the second argument simultaneously.There's a possibility that useref, images, or even fonts gets completed before clean does, which means the entire `dist` folder gets deleted.

// gulp.task('build', [`clean`, `sass`, `useref`, `images`, `fonts`], function (){
//     console.log('Building files');
//   })



gulp.task('useref',function() {
    return gulp.src('app/*.html')
    .pipe(useref())
     // Minifies only if it's a JavaScript file
    .pipe(gulpIf('*.js', uglify()))
    // Minifies only if it's a CSS file
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulp.dest('dist'))
});

gulp.task('images', function(){
    return gulp.src('app/images/**/*.+(png|jpg|gif|svg)')
    .pipe(imagemin({
         // Since different file types can be optimized differently, you might want to add options to imagemin to customize how each file is optimized.
      interlaced: true
    }))
    .pipe(gulp.dest('dist/images'))
  });

  gulp.task('fonts', function() {
    return gulp.src('app/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'))
  });

  gulp.task('clean:dist', function() {
    return del.sync('dist');
  });

//To clear the caches off your local system, you can create a separate task that's named `cache:clear`
gulp.task('cache:clear', function (callback) {
return cache.clearAll(callback)
});

gulp.task('build', function (callback) {
    runSequence('clean:dist', 
      ['sassToCss', 'useref', 'images', 'fonts']
    )
  });

gulp.task('default', function (callback) {
    runSequence(['sassToCss','browserSync', 'watch'],
      callback
    )
  });


gulp.task('browserSync',function() {
    browserSync.init({
        server:{
            baseDir:'app'
        },
    })
})