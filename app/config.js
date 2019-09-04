const fs = require('fs');

const basePath = require('os').homedir() + '/.mission-control-ytdl';
const config = require('rc')('mission-control-ytdl', {
	basePath,
	debug: false,

	http: {
		url: 'http://localhost:3003',
		port: 3003
	},
	missionControl: {
		url: 'http://localhost:3000',
		apiKey: ''
	},
	videosPath: basePath + '/videos',
	audioPath: basePath + '/audio'
});

if (!fs.existsSync(config.basePath)) {
	console.log('Base path not found. Creating base directory ' + config.basePath);

	fs.mkdirSync(config.basePath, { recursive: true });
}

if (!fs.existsSync(config.basePath + '/config')) {
	console.log('Config file not found. Creating...');

	fs.writeFileSync(config.basePath + '/config', 
`; Mission Control Config File
; Enable debug mode here
;debug=true

;[http]
;url=http://localhost:3003
;port=3003

;[missionControl]
;url=
;apiKey

;videosPath=
;audioPath
`
	);
}

if (!fs.existsSync(config.basePath + '/videos')) {
	console.log('Default video path not found. Creating videos directory ' + config.basePath + '/videos');

	if (config.basePath + '/videos' !== config.videosPath) {
		console.log('However, custom videos path used:', config.videosPath);
	}

	fs.mkdirSync(config.basePath + '/videos', { recursive: true });
}

if (!fs.existsSync(config.basePath + '/audio')) {
	console.log('Default audio path not found. Creating audio directory ' + config.basePath + '/audio');

	if (config.basePath + '/audio' !== config.audioPath) {
		console.log('However, custom audio path used:', config.audioPath);
	}

	fs.mkdirSync(config.basePath + '/audio', { recursive: true });
}

module.exports = config;