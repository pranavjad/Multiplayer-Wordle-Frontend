import React from 'react'
function getColorFromState(state) {
    if(state === 'green') return '#6aaa64';
    if(state === 'yellow') return '#c9b458';
    if(state === 'gray') return '#787c7e';
}
function KeyBoard({letterState}) {
    let keyboardRows = [
        "QWERTYUIOP",
        "ASDFGHJKL",
        "ZXCVBNM",
    ];
    return (
    <div className='keyboardContainer'>
        {
            keyboardRows.map(row => {
                return <div className='keyboardRow' key={row}> 
                    {
                        row.split('').map(c => (
                            <div key={`keyboard${c}`} style={{
                                backgroundColor: getColorFromState(letterState[c])
                            }}>
                                {c}
                            </div>
                        ))
                    }
                </div>
            })
        }
        {/* <div className='keyboardRow'>
            {
                keyboardRows[0].split('').map(c => (
                    <div key={c}>{c}</div>
                ))
            }
        </div>
        <div className='keyboardRow'>
            {
                keyboardRows[1].split('').map(c => (
                    <div key={c}>{c}</div>
                ))
            }
        </div>
        <div className='keyboardRow'>
            {
                keyboardRows[2].split('').map(c => (
                    <div key={c}>{c}</div>
                ))
            }
        </div> */}
    </div>
    )
}

export default KeyBoard