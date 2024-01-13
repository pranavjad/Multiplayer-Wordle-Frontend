import {useEffect, useState, useContext} from 'react'
import WordBank from '../utils/word-bank.json'
import WordRow from './WordRow'
import ScoreBoard from './ScoreBoard'
import WordInput from './WordInput'
import checkGuess from '../utils/word-utils'
import {SocketContext} from '../contexts/socket'
import KeyBoard from './KeyBoard'
import { AuthContext } from '../contexts/auth'
import { Navigate } from 'react-router-dom'
const MAX_GUESSES = 5;
function isLetter(str) {
    return str.length === 1 && str.match(/[a-z]/i);
}

function checkWin(colorArray){
    for(let color of colorArray){
        if(color !== 'green') return false;
    }
    return true;
}
function getDefaultLetterState() {
  let res = {};
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('').map(l => {
    res[l] = 'lightgray';
  });
  return res;
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
    // const [playerMap,setPlayerMap] = useState({});
    const [master,setMaster] = useState({});
    const [inGame,setInGame] = useState(false);
    const [imMaster,setImMaster] = useState(false);
    const [letterState, setLetterState] = useState(getDefaultLetterState());
    const auth = useContext(AuthContext);
    // handle a key press
    const onKeyDown = (e) => {
      if(!inGame || imMaster || curRow > MAX_GUESSES) return;
      const letter = e.key;
      // submitted guess
      if(guess.length === MAX_GUESSES && letter === 'Enter') {

          const clues = checkGuess(guess,answer);
          
          setLetterState(curLetterState => {
            let newLetterState = Object.assign({}, curLetterState);
            let upperCaseGuess = guess.toUpperCase();
            clues.map((clue,idx) => {
              if(clue === 'green') newLetterState[upperCaseGuess[idx]] = 'green';
              else if(clue === 'yellow' && newLetterState[upperCaseGuess[idx]] !== 'green') newLetterState[upperCaseGuess[idx]] = 'yellow';
              else if(clue === 'gray' && newLetterState[upperCaseGuess[idx]] === 'lightgray') newLetterState[upperCaseGuess[idx]] = 'gray';
            });
            return newLetterState;
          })
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
            // alert('Won');
            setInGame(false);
            // setSolved(true);
            socket.emit('wordle-solved',1);
          }
          if(curRow === MAX_GUESSES){
            // alert('Game Over');
            socket.emit('wordle-solved',0);
            // return;
          }
          setCurRow(curRow + 1);
      }
      setGuess(curGuess => {
        if(letter === 'Backspace' && curGuess.length !== 0){
            return curGuess.slice(0,-1);
        }
        if(curGuess.length === MAX_GUESSES || !isLetter(letter)) return curGuess;
        
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
        // setPlayerMap(data.playerMap);
        setMaster(data.master);
      });
      socket.emit('req-room-data', data => {
        console.log("room data:")
        console.log(data);
        setPlayerList(data.playerList);
        // setPlayerMap(data.playerMap);
        setMaster(data.master);
      });
      socket.on('scoreboard-update', data => {
        console.log("receieved scoreboard update", data);
        console.log(playerList);
        setPlayerList(curPlayerList => {
          let res = JSON.parse(JSON.stringify(curPlayerList));
          // console.log(res);
          let scorerIndex = res.findIndex(e => e.socketid === data.scorer);
          res[scorerIndex].score += data.point;
          res[scorerIndex].inGame = false;
          return res;
        });
      });
      socket.on('new-player', data => {
        console.log(`new player ${data.username} joined`);
        // setPlayerMap(curPlayerMap => {
        //   curPlayerMap[data.socketid] = data;
        //   return curPlayerMap;
        // });
        setPlayerList(curPlayerList => {
          let newPlayerList = JSON.parse(JSON.stringify(curPlayerList));
          newPlayerList.push(data);
          return newPlayerList;
        });
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
        // setPlayerMap(curPlayerMap => {
        //   delete curPlayerMap[data.socketid];
        //   return curPlayerMap;
        // });
        setPlayerList(curPlayerList => {
          let newPlayerList = JSON.parse(JSON.stringify(curPlayerList));
          newPlayerList = newPlayerList.filter(player => player.socketid !== data.socketid);
          return newPlayerList;
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
    },[]);

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
      setLetterState(getDefaultLetterState());
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
    if(!auth.signedIn) {
      return (
        <Navigate to="/" replace={true} />
      )
    }
    return (
    <div>
        <h1>Multiplayer Wordle</h1>
        {
            guesses.map((g,idx) => {
                if(idx === curRow){
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
        <WordInput imMaster={imMaster}  inGame={inGame} playerList={playerList}  />
        <KeyBoard letterState={letterState} />
    </div>
  )
}


export default Wordle