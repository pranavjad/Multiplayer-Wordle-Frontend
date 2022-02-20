import React from 'react'

function WordRow({letters}) {
    const letterArray = letters.split('');
    return (
    <div className='word-row'>
        {
            letterArray.map((letter,idx) => (
                <div key={idx}>
                    {letter}
                </div>
            ))
        }
    </div>
    )
}

export default WordRow