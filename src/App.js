import React, { useEffect } from 'react';
import './App.css';
import Wordle from './components/Wordle';
import {SocketContext, socket} from './contexts/socket'

function sanitizeString(str){
  str = str.replace(/[^a-z0-9áéíóúñü \.,_-]/gim,"");
  return str.trim();
}

function App() {
  useEffect(() => {
    var username = sanitizeString(prompt("Enter Username: "));
    if(username.length === 0) username = 'Unnamed';
    console.log(username);
    socket.emit('join-room',username);
  });
  return (
    // pass socket context to the rest of the component heirarchy
    <SocketContext.Provider value={socket}>
        <div className="App">
          <Wordle/>
        </div>
    </SocketContext.Provider>
  );
}


export default App;
