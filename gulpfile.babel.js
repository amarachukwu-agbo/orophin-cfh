import gulp from 'gulp';
import gulpLoadPlugin from 'gulp-load-plugins';

const plugins = gulpLoadPlugin();

gulp.task('start', () => {
  plugins.nodemon({
    watch: ['./app', './config', './public', 'server.js'],
    script: './dist/server.js',
    ext: 'js html jade',
    env: { NODE_ENV: 'development' },
  });
});

gulp.task('public', () => gulp.src([
  './public/**/*',
  './app/**/*',
  './config/**/*'
], {
  base: './'
})
  .pipe(gulp.dest('dist')));

gulp.task('transpile', ['public'], () => {
  gulp.src([
    './**/*.js',
    '!dist/**',
    '!gruntfile.js',
    '!gulpfile.babel.js',
    '!karma.conf.js',
    '!node_modules/**',
    '!public/lib/**'
  ])
    .pipe(plugins.babel({
      presets: ['es2015']
    }))
    .pipe(gulp.dest('dist'))
    .pipe(plugins.livereload());
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
  .pipe(gulp.dest('./dist/css'))
  .pipe(plugins.livereload()));


gulp.task('bower', () => {
  plugins.bower({ directory: './public/lib' });
});

gulp.task('watch', () => {
  plugins.livereload.listen();
  gulp.watch('./public/**/*.scss', ['sass', 'transpile']);
  gulp.watch('./public/**/*.html', ['transpile']);
  gulp.watch('./public/js/*.js', ['transpile']);
});

gulp.task('default', ['bower', 'transpile', 'start', 'watch']);
