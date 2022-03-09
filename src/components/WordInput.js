import {React, useState, useContext} from 'react'
import {SocketContext} from '../contexts/socket'

function WordInput({imMaster, inGame, playerList}) {
    const socket = useContext(SocketContext);
    let disableInput = (!imMaster || inGame || playerList.length===1);
    const [value,setValue] = useState('');
    // const [submitted,setSubmitted] = useState(false);
    const handleChange = (event) => {
        setValue(event.target.value);
    }
    const handleSubmit = (event) => {
        if(disableInput) return;
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
                    <input type="text" value={value} onChange={handleChange} disabled={disableInput} maxLength={5} minLength={5} pattern="[A-Za-z]*" required/>
                </label>
                <input type="submit" value="Enter" disabled={disableInput} className="submitButton" />
            </form>
        </div>
    )
}

export default WordInput