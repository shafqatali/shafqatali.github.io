var gulp                = require('gulp'),
svgSprite               = require('gulp-svg-sprite'),
// Basic configuration example
config                  = {
    shape               : {
        spacing         : {         // Add padding
           padding     : 0
       },
    },
    mode                : {
        css             : {     // Activate the «css» mode
            render      : {
               css     : true  // Activate CSS output (with default options)
            }
        }
   }
};

gulp.src('**/*.svg', {cwd: 'svg-icons'})
    .pipe(svgSprite(config))
    .pipe(gulp.dest('out'));
    gulp.task('default');