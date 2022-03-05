import {useEffect, useState, useContext} from 'react'
import {SocketContext} from '../contexts/socket'

function ScoreBoard({scoreBoard, users, master}) {
    // const [score,setScore] = useState([
    //    ['John',0],
    //    ['Greg',0],
    // ])
    /*
    [
        [username1, 0],
        [username2, 0]
    ]
    */
    const socket = useContext(SocketContext);
    
    return (
        <div className="scoreBoard">
            <h3> Score </h3>
            {
                Object.keys(scoreBoard).map((socket_id,idx) => {
                    
                    return <div 
                        key={`scoreboard${idx}`} 
                        style={{ 
                            fontWeight:(socket_id === socket.id)?'bold':'normal' 
                        }}
                    >
                        {users[socket_id]} - {scoreBoard[socket_id]} {(socket_id === master) && '✏️'}
                    </div>
                })
            }
        </div>
    )
}

export default ScoreBoard