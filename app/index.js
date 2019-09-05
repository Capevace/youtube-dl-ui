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
app.use(morgan('tiny'));

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
	console.log('Socket connected');
	
	socket.emit('queue-update', { queue: videos });

	socket.on('remove-from-queue', data => {
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

		videos[id] = video;
		pushVideoQueue();

		try {
			await download(data.url, {
				extractAudio: data.extractAudio
			}, (outputLine) => {
				video.output.push(outputLine);
				pushVideoQueue();
			});

			delete videos[id];
			pushVideoQueue();

		} catch (e) {
			videos[id].error = e.toString();
			pushVideoQueue();
		}
	});
});

http.listen(config.http.port, () => console.log('YTDL listening on port', config.http.port));