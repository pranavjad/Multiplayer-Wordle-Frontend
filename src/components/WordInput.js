import {React, useState, useEffect, useContext} from 'react'
import {SocketContext} from '../contexts/socket'

function WordInput({master, inGame, scoreBoard}) {
    const socket = useContext(SocketContext);
    const isMaster = socket.id === master;
    const [value,setValue] = useState('');
    // const [submitted,setSubmitted] = useState(false);
    const handleChange = (event) => {
        setValue(event.target.value);
    }
    const handleSubmit = (event) => {
        if(!isMaster || inGame || Object.keys(scoreBoard).length===1) return;
        // alert(value);
        socket.emit('new-word', value);
        // setSubmitted(true);
        event.preventDefault();
    };
    
    return (
        <div className="wordInput">
            <form onSubmit={handleSubmit}>
                <label>
                    <h3>Secret Word: <span>{value}</span></h3>
                    <input type="text" value={value} onChange={handleChange} disabled={!isMaster || inGame || Object.keys(scoreBoard).length===1} maxLength={5} minLength={5} />
                </label>
                <input type="submit" value="Enter" disabled={!isMaster || inGame || Object.keys(scoreBoard).length===1} className="submitButton" />
            </form>
        </div>
    )
}

export default WordInput