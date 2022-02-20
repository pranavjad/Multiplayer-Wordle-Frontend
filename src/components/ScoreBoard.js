import {useEffect,useState} from 'react'

function ScoreBoard({scoreBoard}) {
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
    return (
        <div className="scoreBoard">
            <h3> Score </h3>
            {
                scoreBoard.map((s,idx) => {
                    return <div key={`scoreboard${idx}`}>{s[0]} - {s[1]}</div>
                })
            }
        </div>
    )
}

export default ScoreBoard