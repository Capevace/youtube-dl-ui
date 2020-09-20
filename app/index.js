#!/usr/bin/env node

const config = require('./config');
const cuid = require('cuid');
const fs = require('fs');
const morgan = require('morgan');
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const download = require('./download');

//
// SETUP MISSION CONTROL CLIENT
//
// const client = new MissionControlClient(
// 	config.missionControlUrl,
// 	config.missionControlApiKey
// );

// client.on('connect', () => console.log('Connected to Mission Control.'));
// client.on('disconnect', reason =>
// 	console.log('Disconnected from Mission Control:', reason)
// );
// client.on('error', (errorType, errorData) =>
// 	console.log('An error occurred with the socket:', errorType, errorData)
// );


//
// SETUP EXPRESS SERVER
//
app.use(morgan('[HTTP] :remote-addr :remote-user :method :url HTTP/:http-version :status :res[content-length] - :response-time ms'));

app.get('/', (req, res) => {
	const pageContent = fs.readFileSync(__dirname + '/views/index.html')
		.toString()
		.replace(/\{\{SOCKET_PATH\}\}/g, config.http.socketPath);

	res.set('Content-Type', 'text/html').send(pageContent);
});


//
// SETUP SOCKET.IO SERVER
//
let videos = {};
const pushVideoQueue = () => {
	io.sockets.emit('queue-update', { queue: videos });
};

io.on('connection', (socket) => {
	socket.emit('queue-update', { queue: videos });

	socket.on('remove-from-queue', data => {
		console.log('Removing item from queue:', data.id);

		delete videos[data.id];
		pushVideoQueue();
	});

	socket.on('download', async data => {
		const id = cuid();

		let video = {
			id,
			started: new Date(),
			url: data.url,
			error: null,
			output: []
		};

		
		console.log(`[${id}] Downloading`, data.url);
		video.output.push(`Downloading ${data.url}`);

		videos[id] = video;
		pushVideoQueue();

		try {
			await download(data.url, {
				extractAudio: data.extractAudio
			}, (outputLine) => {
				console.log(`[${id}] ${outputLine}`);

				video.output.push(outputLine);
				pushVideoQueue();
			});

			console.log(`[${id}] Download successful`);

			delete videos[id];
			pushVideoQueue();

		} catch (e) {
			console.log(`[${id}] Download failed:`, e);

			videos[id].error = e.toString();
			pushVideoQueue();
		}
	});
});

http.listen(config.http.port, () => console.log('[YTDL] Listening on port', config.http.port));