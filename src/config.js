const fs = require('fs');
const argv = require('./argv');

const basePath =
	process.env.NODE_ENV === 'production'
		? '/etc/youtube-dl-ui'
		: require('os').homedir() + '/.youtube-dl-ui';

const defaultVideoPath = basePath + '/video';
const defaultAudioPath = basePath + '/audio';

const config = require('rc')('youtube-dl-ui', {
	basePath,
	debug: false,

	http: {
		// url: 'http://localhost:3003',
		socketPath: '/socket.io',
		port: 3003,
	},
	// missionControl: {
	// 	url: 'http://localhost:3000',
	// 	apiKey: ''
	// },
	videoPath: defaultVideoPath,
	audioPath: defaultAudioPath,
	youtubeDl: 'youtube-dl',
});

config.debug = argv.debug || !!process.env.DEBUG || config.debug;

config.http.port = argv.port || process.env.PORT || config.http.port;
config.http.socketPath =
	argv.socketPath || process.env.SOCKET_PATH || config.http.socketPath;

config.videoPath = argv.videoPath || process.env.VIDEO_PATH || config.videoPath;
config.audioPath = argv.audioPath || process.env.AUDIO_PATH || config.audioPath;
config.youtubeDl = argv.youtubeDl || process.env.YOUTUBE_DL || config.youtubeDl;

// Create base config file
// (taken out for now, I don't think it's needed but let's see) - 2021-11-04

// if (!fs.existsSync(config.basePath)) {
// 	console.log('Base path not found. Creating base directory ' + config.basePath);

// 	fs.mkdirSync(config.basePath, { recursive: true });
// }

// if (!fs.existsSync(config.basePath + '/config')) {
// 	console.log('Config file not found. Creating...');

// 	fs.writeFileSync(config.basePath + '/config',
// `; YTDL Config File
// ; Enable debug mode here
// ;debug=true

// ;videoPath=
// ;audioPath=

// ;[http]
// ;port=3003
// `
// 	);
// }

// Create download directories, if no custom ones are passed and the default ones don't exist
if (config.videoPath === defaultVideoPath && !fs.existsSync(defaultVideoPath)) {
	console.log('Default video directory not found.');
	console.log('Creating folder ' + defaultVideoPath);

	fs.mkdirSync(defaultVideoPath, { recursive: true });
}

if (config.audioPath === defaultAudioPath && !fs.existsSync(defaultAudioPath)) {
	console.log('Default audio directory not found.');
	console.log('Creating folder ' + defaultAudioPath);

	fs.mkdirSync(defaultAudioPath, { recursive: true });
}

// Log configuration
console.log('=== Using Configuration ===');
console.log(`Debug Mode: ${config.debug ? 'Enabled' : 'Disabled'}`);
console.log(`Video directory: ${config.videoPath}`);
console.log(`Audio directory: ${config.audioPath}`);
console.log(`HTTP port: 	`, config.http.port); // sperate argument, for number color
console.log(`YouTube-DL path: ${config.http.socketPath}`);
console.log(`Socket URL path: ${config.http.socketPath}`);
console.log('');

module.exports = config;
