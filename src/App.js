import React from 'react';
import './App.css';
import Wordle from './components/Wordle';
import {SocketContext, socket} from './contexts/socket'



function App() {
  
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
