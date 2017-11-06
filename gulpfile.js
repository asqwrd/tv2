
var gulp = require('gulp');
var shell = require('gulp-shell');



//builds all files
gulp.task('build',function(){
  target_directory = process.cwd();
  return gulp.src('.')
  .pipe(shell([
    '"' + target_directory + '/node_modules/.bin/ng" build --aot --prod -oh --sm'
  ],{cwd:'./src'}))
});


//builds and bundles typescript and angular for development
gulp.task('build-dev',function(callback){
  target_directory = process.cwd();
  return gulp.src('.')
  .pipe(shell([
    '"' + target_directory + '/node_modules/.bin/ng" build --dev -oh -ec'
  ],{cwd:'./src'}))

});
