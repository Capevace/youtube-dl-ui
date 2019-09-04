const config = require('./config');
const promisify = require('util').promisify;
const execYTDL = promisify(require('youtube-dl').exec);

async function download(url, options = {}) {
	console.log('Downloading', url);
	const output = await execYTDL(
		url,
		options.extractAudio 
			? ['-x', '--audio-format', 'mp3']
			: ['--format', 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best'],
		{ cwd: options.extractAudio ? config.audioPath : config.videosPath }
	);
	console.log('Finished Downloading', url, output);
}

module.exports = download;