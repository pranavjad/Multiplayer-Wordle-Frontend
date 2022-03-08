import React from 'react';
import socketio from 'socket.io-client';

const SERVER_URL = 'https://143.198.53.176:3001';
const LOCAL_SERVER = 'http://localhost:3001';
export const socket = socketio.connect(LOCAL_SERVER, {
    secure: true,
});
export const SocketContext = React.createContext();