const config = require('./config');
const promisify = require('util').promisify;
const sanitizeUrl = require('@braintree/sanitize-url').sanitizeUrl;

const { spawn } = require('child_process');
const fs = require('fs');

function download(url, options = {}, onOutput = () => {}) {
	return new Promise((resolve, reject) => {
		console.log('Downloading', url);

		const safeUrl = sanitizeUrl(url);
		const cwd = options.extractAudio ? config.audioPath : config.videosPath;

		if(!fs.existsSync(cwd)) {
			return reject(new Error('The specified download directory: ' + cwd + ' does not exist.'));
		}

		const downloadProcess = spawn(
			'youtube-dl', 
			options.extractAudio 
				? ['-x', '--audio-format', 'm4a', safeUrl]
				: ['--format', 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best', safeUrl],
			{ cwd }
		);

		onOutput('[YTDL] Starting download...');

		let stdout = '';
		downloadProcess.stdout.on('data', (line) => {
			console.log(line.toString());
			stdout += line;

			onOutput(String(line));
		});

		let stderr = '';
		downloadProcess.stderr.on('data', (data) => {
			stderr += data;
		});

		downloadProcess.on('close', (code) => {
			if (stderr !== '') {
				console.log(stderr);
				reject(new Error(String(stderr)));
			} else {
				resolve();
			}
		});
	});
}

module.exports = download;