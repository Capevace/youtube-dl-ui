const config = require('./config');
const promisify = require('util').promisify;
const sanitizeUrl = require('@braintree/sanitize-url').sanitizeUrl;

const { spawn } = require('child_process');

function download(url, options = {}, onOutput = () => {}) {
	return new Promise((resolve, reject) => {
		console.log('Downloading', url);

		const safeUrl = sanitizeUrl(url);

		const downloadProcess = spawn(
			'youtube-dl', 
			options.extractAudio 
				? ['-x', '--audio-format', 'm4a', safeUrl]
				: ['--format', 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best', safeUrl],
			{ cwd: options.extractAudio ? config.audioPath : config.videosPath }
		);

		let stdout = '';
		downloadProcess.stdout.on('data', (line) => {
			console.log(line.toString());
			stdout += line;

			onOutput(String(line));
		});

		let stderr = '';
		downloadProcess.stderr.on('data', (data) => {
			console.log('error while downloading:', data);
			stderr += data;
		});

		downloadProcess.on('close', (code) => {
			if (stderr !== '') {
				reject(new Error(String(stderr)));
			} else {
				resolve();
			}
		});
	});
}

module.exports = download;