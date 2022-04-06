import React, { useEffect } from 'react';
import './App.css';
import Wordle from './components/Wordle';
import {SocketContext, socket} from './contexts/socket'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import WelcomeScreen from './components/WelcomeScreen';
import { AuthContext, auth } from './contexts/auth';

function sanitizeString(str){
  str = str.replace(/[^a-z0-9áéíóúñü \.,_-]/gim,"");
  return str.trim();
}

function App() {
  // useEffect(() => {
  //   var username = sanitizeString(prompt("Enter Username: "));
  //   if(username.length === 0) username = 'Unnamed';
  //   console.log(username);
  //   socket.emit('join-room',username);
  // });
  return (
    <AuthContext.Provider value={auth} >
      <SocketContext.Provider value={socket}>
          <BrowserRouter>
            <Routes>
              <Route exact path="/" element={<WelcomeScreen />} />
              <Route exact path="/game" element={<Wordle />} />
            </Routes>
            {/* <div className="App">
              <Wordle/>
            </div> */}
          </BrowserRouter>
          
      </SocketContext.Provider>
    </AuthContext.Provider>
  );
}


export default App;
