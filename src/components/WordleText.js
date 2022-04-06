import React from 'react'

function WordleText({text, size}) {
    let sizecss = `${size}px`;
    let fontsz = `${Math.floor(size*0.7)}px`
    return (
        <div className="WordleText" >
            {
                [...text].map((c,idx) => (
                    <div id={idx} style={{
                        width: sizecss,
                        height: sizecss,
                        lineHeight: sizecss,
                        fontSize: fontsz,
                    }}>
                        {c}
                    </div>
                ))
            }
        </div>
    )
}

export default WordleText