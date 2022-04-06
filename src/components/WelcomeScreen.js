import {React, useState, useContext, useEffect} from 'react'
import WordleText from './WordleText'
import {SocketContext} from '../contexts/socket'
import { Navigate, useNavigate } from "react-router-dom";
import { AuthContext } from '../contexts/auth';

function WelcomeScreen(props) {
    const socket = useContext(SocketContext);
    const auth = useContext(AuthContext);
    const [userName, setUserName] = useState('');
    const navigate = useNavigate();
    const onChange = (event) => {
        setUserName(event.target.value);
    }
    const handleClick = (event) => {
        if(userName.length === 0) setUserName('unnamed');
        console.log(userName);
        socket.emit('join-room',userName);
        auth.username = userName;
        auth.signedIn = true;
        navigate("/game");
    }
    if(auth.signedIn){
        return (
            <Navigate to="/game" replace={true}/>
        )
    }
    return (
    <div className="WelcomeScreen">
        {/* <h1>Multiplayer Wordle</h1> */}
        <div className='Title'>
            <WordleText text="Multiplayer" size={50}/>
            <WordleText text="Wordle" size={50}/>
        </div>
        <div className='WelcomeScreenActions'>
            {/* <p>{userName}</p> */}
            <input type="text" name="name" placeholder='Enter Your Name' onChange={onChange}/>
            <button id='findGame' onClick={handleClick}>Find Game</button>
            <button id='joinGame'>Join Game</button>
            <button id='createGame'>Create Game</button>
        </div>
    </div>
    )
}

export default WelcomeScreen