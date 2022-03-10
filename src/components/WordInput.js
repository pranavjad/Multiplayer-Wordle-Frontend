import {React, useState, useContext} from 'react'
import {SocketContext} from '../contexts/socket'

import {AiFillEye, AiFillEyeInvisible} from 'react-icons/ai';

function WordInput({imMaster, inGame, playerList}) {
    const socket = useContext(SocketContext);
    let disableInput = (!imMaster || inGame || playerList.length===1);
    const [value,setValue] = useState('');
    const [showInput,setShowInput] = useState(false);
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
    const toggleShowInput = (event) => {
        setShowInput(s => !s);
        event.preventDefault();
    }
    return (
        <div className="wordInputContainer">
            <form onSubmit={handleSubmit} autoComplete="off">
                <h3>Secret Word: <span>{showInput? value : '*'.repeat(value.length)}</span></h3>
                <div className='wordInputRow'>
                    <div className="wordInputField">
                            <input type={showInput?"text":"password"} value={value} onChange={handleChange} disabled={disableInput} maxLength={5} minLength={5} pattern="[A-Za-z]*" required/>
                            <button className="iconButton" onClick={toggleShowInput}>
                                {showInput? <AiFillEye  size='20' /> : <AiFillEyeInvisible size='20' />}
                            </button>
                    </div>
                    <input type="submit" value="Enter" disabled={disableInput} className="submitButton" />
                </div>
            </form>
            
        </div>
    )
}

export default WordInput