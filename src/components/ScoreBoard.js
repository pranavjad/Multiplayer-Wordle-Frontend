import {useEffect, useState, useContext} from 'react'
import {SocketContext} from '../contexts/socket'

function ScoreBoard({playerList, master}) {
    const socket = useContext(SocketContext);
    
    return (
        <div className="scoreBoard">
            <h3> Score </h3>
            {
                playerList.map((player, idx) => {
                    console.log(playerList);
                    return <div 
                        key={`scoreboard${idx}`} 
                        style={{ 
                            fontWeight:(player.socketid === socket.id)?'bold':'normal' 
                        }}
                    >
                        {player.username} - {player.score} {(master && player.socketid === master.socketid) && '✏️'}
                    </div>
                })
            }
        </div>
    )
}

export default ScoreBoard