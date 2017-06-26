var gulp = require('gulp');

var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var cssMin = require('gulp-css');
var tinypng = require('gulp-tinypng-compress');

/*gulp 合成雪碧图*/
var buffer = require('vinyl-buffer');
var csso = require('gulp-csso');
var imagemin = require('gulp-imagemin');
var merge = require('merge-stream');
var spritesmith = require('gulp.spritesmith');
/*gulp 合成雪碧图*/

var postcss = require('gulp-postcss');
var px2rem = require('postcss-px2rem');
var eslint = require('gulp-eslint');


gulp.task('scripts', function() {
  gulp.src('src/js/main.js') //压缩js文件
    .pipe(concat('main.min.js')) //输出文件名称
    .pipe(uglify())
    .pipe(gulp.dest('dist/js')) //输出文件目录
});

gulp.task('cssMinfy', function() {
  return gulp.src('src/css/weeknews.css')
    .pipe(concat('main.min.css')) //输出文件名称
    .pipe(cssMin())
    .pipe(gulp.dest('dist/css'))
});

gulp.task('tinypng', function() {
  gulp.src('src/image/*.jpg')
    .pipe(tinypng({
      key: '9Zu6FdEJEFUBZDt8of56ksUrj2cOToAI', //这个key 每个月只能压缩500张图片，超过就要付费，可以去tinypng.com注册新的邮箱拿key
      sigFile: 'images/.tinypng-sigs',
      log: true
    }))
    .pipe(gulp.dest('dist/image'));
});

gulp.task('lint', () => {
    // ESLint ignores files with "node_modules" paths.
    // So, it's best to have gulp ignore the directory as well.
    // Also, Be sure to return the stream from the task;
    // Otherwise, the task may end before the stream has finished.
    return gulp.src(['src/js/aa.js','!node_modules/**'])
        // eslint() attaches the lint output to the "eslint" property
        // of the file object so it can be used by other modules.
        .pipe(eslint())
        // eslint.format() outputs the lint results to the console.
        // Alternatively use eslint.formatEach() (see Docs).
        .pipe(eslint.format())
        // To have the process exit with an error code (1) on
        // lint error, return the stream and pipe to failAfterError last.
        .pipe(eslint.failAfterError());
});

/*
图片切图尺寸和设计稿尺寸相同的时候可以用 sprite 这个功能，其余情况均不可用。

主要是 width，height 这两个属性是整张图的大小尺寸，默认 background-size 是100%，没有参数可以调整
*/
gulp.task('sprite', function() {
  var spriteData = gulp.src('dist/image/*.png').pipe(spritesmith({
    imgName: 'sprite.min.png',
    cssName: 'sprite.less',
    imgPath: '../spriteImage/sprite.min.png',
    cssFormat: 'css',
    //retinaSrcFilter: ['images/*@2x.png'], //用于合并 retina 图
    //retinaImgName: 'sprite@2x.png',  //用于生成 retina 图的雪碧图，和前一个注释同时打开同时关闭
    padding: 20, // 设置图与图之间的间隙，默认是1px
    cssVarMap: function(sprite) {
    	sprite.name = sprite.name
    }
  }));
  var imgStream = spriteData.img
    // DEV: We must buffer our stream into a Buffer for `imagemin`
    .pipe(buffer())
    .pipe(imagemin())
    .pipe(gulp.dest('dist/spriteImage'));

  var cssStream = spriteData.css
    .pipe(csso())
    .pipe(gulp.dest('dist/css'));

  return merge(imgStream, cssStream);
});

gulp.task('pix2rem', function() { //px to rem  这里设置单位
  var processors = [px2rem({
    remUnit: 75
  })]; //这里设置 多少px=1rem
  return gulp.src('src/css/abc.css') //输入文件地址
    .pipe(concat('main.css')) //输出文件名称
    .pipe(postcss(processors))
    .pipe(gulp.dest('src/css/'));
});

gulp.task('images', function() {
  return gulp.src('src/image/*.png')
    .pipe(tinypng({
      key: '9Zu6FdEJEFUBZDt8of56ksUrj2cOToAI', //这个key 每个月只能压缩500张图片，超过就要付费，可以去tinypng.com注册新的邮箱拿key
      sigFile: 'images/.tinypng-sigs',
      log: true
    }))
    .pipe(gulp.dest('public/dist/images'))
    .pipe(gulp.dest('dist/image'));
});





//默认函数，直接console 执行 gulp 就行了
gulp.task('default', function() {

  var js_path = gulp.src('src/js/main.js') //压缩js文件
    .pipe(concat('main.min.js')) //输出文件名
    .pipe(uglify())
    .pipe(gulp.dest('dist/js')); //输出文件目录


  var css_path = gulp.src('src/css/weeknews.css') //压缩css 文件
    .pipe(concat('weeknews.min.css'))
    .pipe(cssMin())
    .pipe(gulp.dest('dist/css'));

  var compress_image = gulp.src('src/image/*.png') //压缩png文件, 这个压缩率不够高，采用a
    .pipe(tinypng({
      key: '9Zu6FdEJEFUBZDt8of56ksUrj2cOToAI', //这个key 每个月只能压缩500张图片，超过就要付费，可以去tinypng.com注册新的邮箱拿key
      sigFile: 'images/.tinypng-sigs',
      log: true
    }))
    .pipe(gulp.dest('dist/image'));

  var processors = [px2rem({
    remUnit: 2
  })]; //这里设置 多少px=1rem
  gulp.src('src/css/abc.css') //输入文件地址
    .pipe(concat('ttt.css')) //输出文件名称
    .pipe(postcss(processors))
    .pipe(gulp.dest('dist/css'));
});

