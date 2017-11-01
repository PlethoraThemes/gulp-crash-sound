// https://github.com/gulpjs/gulp/issues/293
var os    = require('os');
var fs    = require('fs');
var path  = require('path');
var exec  = require('child_process').exec;
var wav   = require('wav');
var gutil = require('gulp-util');
var sound = {
	file: __dirname + '/sounds/gulp.wav'
	, duration: null
};

exports.config = config;
exports.play   = play;
exports.plumb  = plumb;

process.on('uncaughtException', function(err) {
	play();
	throw err;
});

function config(options) {
	if (options.duration) {
		sound.duration = parseInt(options.duration);
	}
		
	if (options.file) {
		fs.exists(options.file, function(exists) {
			var ext = path.extname(options.file);
			
			// return early if;
			// file doesn't exist
			if (!exists) {
				return gutil.log('[' + gutil.colors.red('gulp-crash-sound') + ']', 'File doesn\'t exist');
			}
			
			// or isnt a wav (not supported file)
			if (ext !== '.wav') {
				return gutil.log('[' + gutil.colors.red('gulp-crash-sound') + ']', 'Only WAV files are supported');
			}
			
			sound.file = options.file;
		});
	}
}

function play() {
	switch (os.platform()) {
		case 'linux':
			exec('aplay ' + (sound.duration ? ('-d' + sound.duration) : '') + ' ' + sound.file);
			break;
		
		case 'darwin':
			exec('afplay ' + (sound.duration ? ('-t' + sound.duration) : '') + ' ' + sound.file);
			break;
		
	}
}

function plumb(fn) {
	return function(err) {
		play();
		fn(err);
	};
}