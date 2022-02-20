import React from 'react'
import WordBank from '../utils/word-bank.json'
import WordRow from './WordRow'

function Wordle() {

  return (
    <div>
        <h1>Wordle</h1>
        <WordRow letters={'crane'}/>
        <WordRow letters={'crane'}/>
        <WordRow letters={'crane'}/>
        <WordRow letters={'crane'}/>
        <WordRow letters={'crane'}/>
        
    </div>
  )
}

export default Wordle