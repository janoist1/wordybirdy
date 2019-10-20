import React, { useState } from 'react'
import ls from 'local-storage'
import { FreeMode, ChallengeMode } from '../Mode'
import AppContext from './AppContext'
import './App.css'
//&preview=3

const getWords = () => require('!!csv-loader?header=true!../../words.csv') // eslint-disable-line import/no-webpack-loader-syntax

const rebuildWords = () => {
  const words = getWords()

  for (let i in words) {
    console.log({ i, word: words[i] })
  }
}

const WordsRebuild = ({ onDone }) => {
  const handleClick = () => {
    rebuildWords()
    onDone()
  }

  return (
    <div className="words-rebuild">
      <button onClick={handleClick}>rebuild words</button>
    </div>
  )
}

const createProgress = words => words.reduce((progress, _, number) => ({ ...progress, [number]: 0 }), {})

const ModeChooser = ({ onClick }) => {
  const handleClick = mode => () => {
    onClick(mode)
  }

  return (
    <div className="mode-chooser">
      <h3>Choose mode:</h3>

      <button onClick={handleClick('free')}>free</button>
      <button onClick={handleClick('10')}>10 challenge</button>
      <button onClick={handleClick('25')}>25 challenge</button>
      <button onClick={handleClick('50')}>50 challenge</button>
    </div>
  )
}

function App() {
  const [mode, setMode] = useState('home')
  const [progress, setProgress] = useState()
  const [words, setWords] = useState()
  const [loading, setLoading] = useState(false)

  const handleWordsRebuildDone = () => {

  }

  const handleModeClick = mode => {
    switch (mode) {
      case 'home':
      default:
        setProgress()
        break

      case '10':
      case '25':
      case '50':
        const words = getWords().slice(0, +mode)

        setWords(words)
        setProgress(createProgress(words))
        break

      case 'free':
        if (!ls('progress')) {
          // ls('progress', createProgress(getWords()))
          ls('progress', {
            [mode]: createProgress(getWords()),
          })
        }

        setWords(getWords())
        setProgress(ls('progress')[mode])
        break
    }

    setMode(mode)
  }

  const handleProgress = know => number => {
    know && setProgress({
      ...progress,
      [number]: progress[number] + 1,
    })

    // ls('progress', progress)
  }

  return (
    <div className="App">
      <AppContext.Provider value={{ loading, setLoading }}>
        <header className="App-header">
          {mode !== 'home' && <button onClick={() => handleModeClick('home')}>home</button>}
          <span>wordybirdy</span>
        </header>

        <main>
          {mode === 'home' && <ModeChooser onClick={handleModeClick} />}

          {mode === 'home' && <WordsRebuild onDone={handleWordsRebuildDone} />}

          {mode === 'free' && <FreeMode
            words={words}
            progress={progress}
            onIKnow={handleProgress(true)}
            onIDontKnow={handleProgress(false)}
          />}

          {mode === '10' && <ChallengeMode
            words={words}
            progress={progress}
            onIKnow={handleProgress(true)}
            onIDontKnow={handleProgress(false)}
          />}

          {loading && <div><h5>Loading...</h5></div>}
        </main>
      </AppContext.Provider>
    </div>
  )
}

export default App
