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
    const [scoreBoard,setScoreBoard] = useState({});
    const [users,setUsers] = useState({});
    const [master,setMaster] = useState('');
    const [inGame,setInGame] = useState(false);
    // handle a key press
    const onKeyDown = (e) => {
      if(!inGame || (socket.id === master) || curRow > 5) return;
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
      // socket.on('scoreboard-update', newScoreBoard => {
      //   console.log(newScoreBoard);
      //   setScoreBoard(newScoreBoard);
      // });
      return () => {
        document.removeEventListener('keydown',onKeyDown);
      }
    });
    useEffect(() => {
      socket.on('scoreboard-update', (payload) => {
        setScoreBoard(payload.scoreBoard);
        setUsers(payload.users);
        setMaster(payload.master);
      });
      socket.on('game-over' ,() => {
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
      if(Object.keys(scoreBoard).length === 1){
        return <h3> Waiting for more players... </h3>
      }
      if(master === socket.id) {
        return <h3> Your turn to create the word! </h3>
      }
      if(!inGame) {
        return <h3>Waiting for next round to start ...</h3>
      }
      if(inGame) {
        return <h3>Start Guessing!</h3>
      }
    }
    return (
    <div>
        <h1>Multiplayer Wordle</h1>
        {
            guesses.map((g,idx) => {
                if(idx == curRow){
                    return <WordRow key={`${idx}wordrow`}  letters={guess} letterState={tileColors[idx]}/>
                }
                return <WordRow key={`${idx}wordrow`} letters={g} letterState={tileColors[idx]}/>
            })
        }
        <div className="gameStatus">
          {
            renderStatus()
          }
        </div>
        <ScoreBoard scoreBoard={scoreBoard} users={users} master={master} />
        <WordInput master={master}  inGame={inGame} scoreBoard={scoreBoard} />
    </div>
  )
}


export default Wordle