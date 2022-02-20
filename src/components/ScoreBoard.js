import {useEffect,useState} from 'react'

function ScoreBoard() {
    const [score,setScore] = useState({
        player1: 0,
        player2: 0,
    })
    return (
        <div className="scoreBoard">
            <h3> Score </h3>
            {
                Object.keys(score).map((user,idx) => {
                    return <div key={`scoreboard${idx}`}>{user} - {score[user]}</div>
                })
            }
        </div>
    )
}

export default ScoreBoard