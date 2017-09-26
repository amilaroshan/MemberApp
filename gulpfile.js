var gulp = require('gulp');
var sass = require('gulp-sass');
var inject = require('gulp-inject');
var wiredep = require('wiredep').stream;
var del = require('del');
var browserSync = require('browser-sync').create();

var config = {
     bowerDir: 'bower_components' 
}


// gulp.task('clean', function(cb){
//   del(['dist'], cb);
// });

gulp.task('icons', function() { 
    return gulp.src(config.bowerDir + '/fontawesome/fonts/**.*') 
        .pipe(gulp.dest('dist/fonts')); 
});

gulp.task('styles',function(){
	var  injectAppFiles = gulp.src('src/styles/*.scss',{read:false});
	var injectGlobalFiles = gulp.src('src/global/*.scss',{read:false});

	function transfromFilepath(filepath){
		return '@import "' + filepath + '";';
	}

	var injectAppOptions = {
		transform:transfromFilepath,
		starttag:'// inject:app',
		endtag:'// endinject',
		addRootSlash:false
	};

	var injectGlobalOptions = {
    transform:transfromFilepath,
    starttag: '// inject:global',
    endtag: '// endinject',
    addRootSlash: false
    };

	return gulp.src('src/main.scss')
	.pipe(wiredep())
	.pipe(inject(injectGlobalFiles, injectGlobalOptions))
	.pipe(inject(injectAppFiles,injectAppOptions))
	.pipe(sass()).pipe(gulp.dest('dist/styles'))
	.pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'dist'
    },
  })
})

gulp.task('html',function () {
		var injectFiles = gulp.src(['dist/styles/main.css']);
	var injectOptions ={
		addRootSlash:false,
		ignorePath:['src','dist']
	};
 	return gulp.src('src/*.html').pipe(inject(injectFiles,injectOptions)).pipe(gulp.dest('dist'));
});

gulp.task('watch',['browserSync'], function(){
  gulp.watch('src/styles/*.scss', ['styles']);
  gulp.watch('src/global/*.scss', ['styles']); 
  gulp.watch('src/*.html',['html',browserSync.reload]); 

  // Other watchers
});



gulp.task('default',['watch','icons','html','browserSync'],function(){
	var injectFiles = gulp.src(['dist/styles/main.css']);
	var injectOptions ={
		addRootSlash:false,
		ignorePath:['src','dist']
	};
	return gulp.src('src/*.html')
		.pipe(inject(injectFiles,injectOptions)).pipe(gulp.dest('dist'));
});