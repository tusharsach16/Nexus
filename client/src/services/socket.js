import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

let socket;

export const initiateSocketConnection = (userId) => {
	socket = io(SOCKET_URL, {
		withCredentials: true,
	});
	
	socket.on('connect', () => {
		console.log(`Socket connected, joining room...`);
		socket.emit('join', userId);
	});
};

export const disconnectSocket = () => {
	console.log('Disconnecting socket...');
	if(socket) socket.disconnect();
};

export const subscribeToMessages = (cb) => {
	if (!socket) return(true);
	socket.on('receive_message', msg => {
		console.log('Websocket event received!');
		return cb(null, msg);
	});
};

export const sendMessage = (messageData) => {
  if (socket) socket.emit('send_message', messageData);
};

export const startTyping = (data) => {
  if (socket) socket.emit('typing_start', data);
};

export const stopTyping = (data) => {
  if (socket) socket.emit('typing_stop', data);
};

export const markMessageSeen = (data) => {
  if (socket) socket.emit('message_seen', data);
};

export const getSocket = () => socket;
