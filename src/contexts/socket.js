import React from 'react';
import socketio from 'socket.io-client';

const SERVER_URL = 'localhost:3001';
export const socket = socketio.connect(SERVER_URL, {
    withCredentials: true,
});
export const SocketContext = React.createContext();