import {useEffect, useState, useContext} from 'react'
import WordBank from '../utils/word-bank.json'
import WordRow from './WordRow'
import ScoreBoard from './ScoreBoard'
import WordInput from './WordInput'
import checkGuess from '../utils/word-utils'
import {SocketContext} from '../contexts/socket'

function isLetter(str) {
    return str.length === 1 && str.match(/[a-z]/i);
}

function checkWin(colorArray){
    for(let color of colorArray){
        if(color != 'green') return false;
    }
    return true;
}
function Wordle() {
    const socket = useContext(SocketContext);
    const [guess,setGuess] = useState('');
    const [guesses,setGuesses] = useState([
        '',
        '',
        '',
        '',
        '',
        '',
    ]);
    const [curRow,setCurRow] = useState(0);
    // const [guessing,setGuessing] = useState(true);
    const [tileColors,setTileColors] = useState([
        ['white','white','white','white','white'],
        ['white','white','white','white','white'],
        ['white','white','white','white','white'],
        ['white','white','white','white','white'],
        ['white','white','white','white','white'],
        ['white','white','white','white','white'],
    ])
    const [answer,setAnswer] = useState('crane');
    // const [scoreBoard,setScoreBoard] = useState({});
    const [playerList,setPlayerList] = useState([]);
    // const [users,setUsers] = useState({});
    const [playerMap,setPlayerMap] = useState({});
    const [master,setMaster] = useState({});
    const [inGame,setInGame] = useState(false);
    const [imMaster,setImMaster] = useState(false);
    // handle a key press
    const onKeyDown = (e) => {
      if(!inGame || imMaster || curRow > 5) return;
      const letter = e.key;
      // submitted guess
      if(guess.length === 5 && letter === 'Enter') {
          const clues = checkGuess(guess,answer);
          setGuesses(prevGuesses => {
              prevGuesses[curRow] = guess;
              return prevGuesses;
          });
          setGuess('');
          setTileColors(prevTileColors => {
              prevTileColors[curRow] = clues;
              return prevTileColors;
          });
          // check for win
          if(checkWin(clues)){
            alert('Won');
            setInGame(false);
            // setSolved(true);
            socket.emit('wordle-solved',1);
          }
          if(curRow === 5){
            alert('Game Over');
            socket.emit('wordle-solved',0);
            // return;
          }
          setCurRow(curRow + 1);
      }
      setGuess(curGuess => {
        if(letter === 'Backspace' && curGuess.length != 0){
            return curGuess.slice(0,-1);
        }
        if(curGuess.length === 5 || !isLetter(letter)) return curGuess;
        
        return curGuess + letter;
        
      });
      console.log(guess);
    }

    // register keypress event listener
    useEffect(() => {
      document.addEventListener('keydown', onKeyDown);
      return () => {
        document.removeEventListener('keydown',onKeyDown);
      }
    });
    // Handle socket stuff
    useEffect(() => {
      socket.on('room-data', data => {
        console.log("room data:")
        console.log(data);
        setPlayerList(data.playerList);
        setPlayerMap(data.playerMap);
        setMaster(data.master);
      });
      socket.on('scoreboard-update', data => {
        console.log("receieved scoreboard update", data);
        console.log(playerList);
        setPlayerList(curPlayerList => {
          let res = curPlayerList.slice();
          console.log(res);
          res[res.findIndex(e => e.socketid === data.scorer)].score += 1;
          return res;
        });
      });
      socket.on('new-player', data => {
        console.log(`new player ${data.username} joined`);
        setPlayerMap(curPlayerMap => {
          curPlayerMap[data.socketid] = data;
          return curPlayerMap;
        });
        setPlayerList(curPlayerList => [...curPlayerList, data]);
      });
      socket.on('new-master', data => {
        setMaster(data);
        if(data.socketid === socket.id){
          setImMaster(true);
        }
        else {
          setImMaster(false);
        }
      });
      socket.on('player-left', data => {
        setPlayerMap(curPlayerMap => {
          delete curPlayerMap[data.socketid];
          return curPlayerMap;
        });
        setPlayerList(curPlayerList => {
          curPlayerList = curPlayerList.filter(player => player.socketid !== data.socketid);
          return curPlayerList;
        });
      });
      socket.on('game-over' , () => {
        setInGame(false);
      });
      socket.on('game-start', (newAnswer) => {
        setAnswer(newAnswer);
        setInGame(true);
        resetBoard();
      });
    },[socket]);

    const resetBoard = () => {
      setGuess('');
      setCurRow(0);
      setTileColors([
        ['white','white','white','white','white'],
        ['white','white','white','white','white'],
        ['white','white','white','white','white'],
        ['white','white','white','white','white'],
        ['white','white','white','white','white'],
        ['white','white','white','white','white'],
      ]);
      setGuesses([
        '',
        '',
        '',
        '',
        '',
        '',
      ]);
    }
    const renderStatus = () => {
      if(playerList.length === 1){
        return <h3> Waiting for more players... </h3>
      }
      if(imMaster) {
        return <h3> Your turn to create the word! </h3>
      }
      if(!inGame) {
        return <h3>Waiting for next round ...</h3>
      }
      if(inGame) {
        return <h3>Start Guessing!</h3>
      }
    }
    const renderScoreBoard = () => {
      if(playerList.length === 0) return;
      return <ScoreBoard playerList={playerList} master={master} />;
    }
    return (
    <div>
        <h1>Multiplayer Wordle</h1>
        {
            guesses.map((g,idx) => {
                if(idx == curRow){
                    return <WordRow key={`${idx}wordrow`}  letters={guess} letterState={tileColors[idx]}/>
                }
                return <WordRow key={`${idx}wordrow`} letters={guesses[idx]} letterState={tileColors[idx]}/>
            })
        }
        <div className="gameStatus">
          {
            renderStatus()
          }
        </div>
        {renderScoreBoard()}
        <WordInput imMaster={imMaster}  inGame={inGame} playerList={playerList} />
    </div>
  )
}


export default Wordle