// Load plugins
var gulp = require( 'gulp' ),
    compass = require( 'gulp-compass' ),
    sass = require( 'gulp-sass' ),
    autoprefixer = require( 'gulp-autoprefixer' ),
    minifycss = require( 'gulp-minify-css' ),
    jshint = require( 'gulp-jshint' ),
    uglify = require( 'gulp-uglify' ),
    imagemin = require( 'gulp-imagemin' ),
    rename = require( 'gulp-rename' ),
    clean = require( 'gulp-clean' ),
    concat = require( 'gulp-concat' ),
    notify = require( 'gulp-notify' ),
    cache = require( 'gulp-cache' ),
    livereload = require( 'gulp-livereload' ),
    lr = require( 'tiny-lr' ),
    server = lr(),
    neat = require( 'node-neat' ).includePaths;

var paths = {
    scss: './src/sass/*.scss'
};

// Content
gulp.task( 'content', function () {
    return gulp.src( [ 'src/**/*.html', 'src/**/*.html.*', 'src/**/*.php', 'src/**/*.php.*' ] )
        .pipe( livereload( server ) )
        .pipe( gulp.dest( 'dist' ) )
        .pipe( notify( {
            message: 'Content task complete'
        } ) );
} );

// CSS
gulp.task( 'styles', function () {
    return gulp.src( paths.scss )
        .pipe( sass( {
            includePaths: [ 'styles' ].concat( neat )
        } ) )
        .pipe( sass( {
            style: 'expanded',
        } ) )
        .pipe( autoprefixer( 'last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4' ) )
        // .pipe(csscss())
        .pipe( gulp.dest( 'dist/css' ) )
        .pipe( rename( {
            suffix: '.min'
        } ) )
        .pipe( minifycss() )
        .pipe( livereload( server ) )
        .pipe( gulp.dest( 'dist/css' ) )
        .pipe( notify( {
            message: 'Styles task complete'
        } ) );
} );

// Scripts
gulp.task( 'scripts', function () {
    return gulp.src( [ 'src/js/vendor/**/*.js', 'src/js/**/*.js' ] )
        .pipe( jshint( '.jshintrc' ) )
        .pipe( jshint.reporter( 'default' ) )
        .pipe( concat( 'main.js' ) )
        .pipe( gulp.dest( 'dist/js' ) )
        .pipe( rename( {
            suffix: '.min'
        } ) )
        .pipe( uglify() )
        .pipe( livereload( server ) )
        .pipe( gulp.dest( 'dist/js' ) )
        .pipe( notify( {
            message: 'Scripts task complete'
        } ) );
} );

// Images
gulp.task( 'images', function () {
    return gulp.src( 'src/img/**/*' )
        .pipe( cache( imagemin( {
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        } ) ) )
        .pipe( livereload( server ) )
        .pipe( gulp.dest( 'dist/img' ) )
        .pipe( notify( {
            message: 'Images task complete'
        } ) );
} );



// Clean
gulp.task( 'clean', function () {
    return gulp.src( [ 'dist/css', 'dist/js', 'dist/img' ], {
            read: false
        } )
        .pipe( clean() );
} );

// Default task
gulp.task( 'default', [ 'clean' ], function () {
    gulp.start( 'content', 'styles', 'scripts', 'images' );
} );

// Watch
gulp.task( 'watch', function () {

    // Listen on port 35729
    server.listen( 35729, function ( err ) {
        if ( err ) {
            return console.log( err )
        };

        // Watch .html files
        gulp.watch( 'src/**/*.html', [ 'content' ] );

        // Watch .scss files
        gulp.watch( 'src/sass/**/*.scss', [ 'styles' ] );
        gulp.watch( 'src/partials/**/*.scss', [ 'styles' ] );

        // Watch .js files
        gulp.watch( 'src/js/**/*.js', [ 'scripts' ] );

        // Watch image files
        gulp.watch( 'src/img/**/*', [ 'images' ] );

    } );

} );