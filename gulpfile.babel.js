import gulp from 'gulp';
import gulpLoadPlugin from 'gulp-load-plugins';
import del from 'del';

const plugins = gulpLoadPlugin();
const pathsToBeDeleted = [
  'public/lib/angular/**/*',
  'public/lib/angular/.*',
  'public/lib/angular-bootstrap/**/*',
  'public/lib/angular-bootstrap/.*',
  'public/lib/angular-ui-utils/*',
  'public/lib/angular-ui-utils/.*',
  'public/lib/bootstrap/*',
  'public/lib/jquery/**/*',
  'public/lib/jquery/.*',
  'public/lib/underscore/**/*',
  'public/lib/underscore/.*',
];
const pathsToExclude = [
  '!public/lib/angular-bootstrap/.bower.json',
  '!public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
  '!public/lib/angular-bootstrap/ui-bootstrap.js',
  '!public/lib/angular/angular.min.js',
  '!public/lib/angular/*.css',
  '!public/lib/angular/.bower.json',
  '!public/lib/angular-ui-utils/.bower.json',
  '!public/lib/angular-ui-utils/modules',
  '!public/lib/bootstrap/.bower.json',
  '!public/lib/bootstrap/dist',
  '!public/lib/jquery/.bower.json',
  '!public/lib/jquery/jquery.js',
  '!public/lib/underscore/.bower.json',
  '!public/lib/underscore/underscore-min.js',
];

gulp.task('start', ['clean'], () => {
  plugins.nodemon({
    watch: ['./app', './config', './public', 'server.js'],
    script: './server.js',
    ext: 'js html jade',
    env: { NODE_ENV: 'development' },
  });
});

gulp.task('reload-html', () => {
  // this will enable nodemon to restart before reloading the file that changed
  setTimeout(() => {
    gulp.src([
      './public/views',
    ]).pipe(plugins.livereload());
  }, 1000);
});
gulp.task('reload-css', () => {
  // this will enable nodemon to restart before reloading the file that changed
  setTimeout(() => {
    gulp.src([
      './public/css',
    ]).pipe(plugins.livereload());
  }, 1000);
});
gulp.task('reload-js', () => {
  // this will enable nodemon to restart before reloading the file that changed
  setTimeout(() => {
    gulp.src([
      './public/js',
    ]).pipe(plugins.livereload());
  }, 1000);
});

gulp.task('clean', () => {
  del(pathsToBeDeleted.concat(pathsToExclude));
});

gulp.task('test', () => gulp.src(
  [
    './test/game/game.js',
    './test/user/model.js',
    './test/article/model.js'
  ],
  { read: false }
)
  .pipe(plugins.coverage.instrument({
    pattern: ['**/test*'],
    debugDirectory: 'debug'
  }))
  .pipe(plugins.mocha({
    timeout: 15000
  }))
  .pipe(plugins.coverage.gather())
  .pipe(plugins.coverage.format())
  .pipe(gulp.dest('reports')));

gulp.task('sass', () => gulp.src('./public/**/*.scss')
  .pipe(plugins.sass().on('error', plugins.sass.logError))
  .pipe(gulp.dest('./public'))
  .pipe(plugins.livereload()));


gulp.task('bower', () => {
  plugins.bower({ directory: 'public/lib' });
});

gulp.task('watch', () => {
  plugins.livereload.listen();
  gulp.watch('./public/**/*.scss', ['sass', 'reload-css']);
  gulp.watch('./public/**/*.html', ['reload-html']);
  gulp.watch('./public/js/*.js', ['reload-js']);
});

gulp.task('default', ['start', 'watch']);
