const fs = require('fs');
const argv = require('./argv');

const basePath = process.env.NODE_ENV === 'production'
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
		port: 3003
	},
	missionControl: {
		url: 'http://localhost:3000',
		apiKey: ''
	},
	videoPath: defaultVideoPath,
	audioPath: defaultAudioPath
});

if (argv.debug) {
	config.debug = argv.debug;
}

if (argv.port) {
	config.http.port = argv.port;
}

if (argv.videoPath) {
	config.videoPath = argv.videoPath;
}

if (argv.audioPath) {
	config.audioPath = argv.audioPath;
}

if (!fs.existsSync(config.basePath)) {
	console.log('Base path not found. Creating base directory ' + config.basePath);

	fs.mkdirSync(config.basePath, { recursive: true });
}

if (!fs.existsSync(config.basePath + '/config')) {
	console.log('Config file not found. Creating...');

	fs.writeFileSync(config.basePath + '/config', 
`; YTDL Config File
; Enable debug mode here
;debug=true

;videoPath=
;audioPath=

;[http]
;port=3003

;[missionControl]
;url=
;apiKey
`
	);
}

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

module.exports = config;