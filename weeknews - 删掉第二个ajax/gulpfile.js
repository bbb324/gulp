var gulp = require('gulp');

var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var cssMin = require('gulp-css');
var tinypng = require('gulp-tinypng-compress');
var sprite = require('gulp-sprite-generator');

var postcss = require('gulp-postcss');
var px2rem = require('postcss-px2rem');
var jshint = require('gulp-jshint');


gulp.task('scripts', function(){
	gulp.src('src/js/main.js') //压缩js文件
		.pipe(concat('main.min.js'))  //输出文件名称
		.pipe(uglify())
		.pipe(gulp.dest('dist/js'))  //输出文件目录
});

gulp.task('cssMinfy', function(){
	return gulp.src('src/css/weeknews.css')
		.pipe(concat('main.min.css'))  //输出文件名称
		.pipe(cssMin())
		.pipe(gulp.dest('dist/css'))
});

gulp.task('tinypng',function(){
	 gulp.src('src/image/*.jpg')
		 .pipe(tinypng({
			 key: '9Zu6FdEJEFUBZDt8of56ksUrj2cOToAI', //这个key 每个月只能压缩500张图片，超过就要付费，可以去tinypng.com注册新的邮箱拿key
			 sigFile: 'images/.tinypng-sigs',
			 log: true
		 }))
		 .pipe(gulp.dest('dist/image'));
});

gulp.task('jshint', function() {  //jshint  引入代码审查机制
    gulp.src('src/js/main.js')
        .pipe(jshint())
		.pipe(jshint.reporter('default'))
});

gulp.task('sprite', function(){
	 var spriteOutput;
    spriteOutput = gulp.src('src/css/weekness.less')
        .pipe(sprite({
            baseUrl:        '/src/image',
            spriteSheetName: "sprite.png",
            spriteSheetPath: 'dist/css',
			styleSheetName:  "/dist/css/stylesheet.css"
        }));
    spriteOutput.css.pipe(gulp.dest("/dist/css"));
    spriteOutput.img.pipe(gulp.dest("/dist/image"));
}) //这个有问题


gulp.task('pix2rem', function() {//px to rem  这里设置单位
  var processors = [px2rem({remUnit: 75})];   //这里设置 多少px=1rem
    return gulp.src('src/css/abc.css')  //输入文件地址
		.pipe(concat('main.css'))  //输出文件名称
        .pipe(postcss(processors))
        .pipe(gulp.dest('src/css/'));
});

gulp.task('images', function() {
	return gulp.src('image/**/*.+(jpg|jpeg|ico|png|gif|svg)')
		.pipe(tinypng({
			key: '9Zu6FdEJEFUBZDt8of56ksUrj2cOToAI', //这个key 每个月只能压缩500张图片，超过就要付费，可以去tinypng.com注册新的邮箱拿key
			sigFile: 'images/.tinypng-sigs',
			log: true
		}))
		.pipe(rev())
		.pipe(gulp.dest('public/dist/images'))
		.pipe(rev.manifest())
		.pipe(gulp.dest('dist/image'));
});





//默认函数，直接console 执行 gulp 就行了
gulp.task('default', function(){
		
		var js_path = gulp.src('src/js/main.js') //压缩js文件
			.pipe(concat('main.min.js'))  //输出文件名
			.pipe(uglify())
			.pipe(gulp.dest('dist/js'));  //输出文件目录
		
		
		var css_path = gulp.src('src/css/weeknews.css')   //压缩css 文件
			.pipe(concat('weeknews.min.css'))
			.pipe(cssMin())
			.pipe(gulp.dest('dist/css'));

		var compress_image = gulp.src('src/image/*.png')  //压缩png文件, 这个压缩率不够高，采用a
			.pipe(tinypng({
				key: '9Zu6FdEJEFUBZDt8of56ksUrj2cOToAI', //这个key 每个月只能压缩500张图片，超过就要付费，可以去tinypng.com注册新的邮箱拿key
				sigFile: 'images/.tinypng-sigs',
				log: true
			}))
			.pipe(gulp.dest('dist/image'));

		var processors = [px2rem({remUnit: 2})];   //这里设置 多少px=1rem
			gulp.src('src/css/abc.css')  //输入文件地址
			.pipe(concat('ttt.css'))  //输出文件名称
			.pipe(postcss(processors))
			.pipe(gulp.dest('dist/css'));


});