import React, { useState } from 'react'
import ls from 'local-storage'
import shuffle from '../../utils/shuffle'
import * as db from '../../db'
import { FreeMode, ChallengeMode } from '../Mode'
import AppContext from './AppContext'
import './App.css'

//&preview=3
// const getWords = () => require('!!csv-loader?header=true&preview=10!../../words.csv') // eslint-disable-line import/no-webpack-loader-syntax

const rebuildWords = async () => {
  const words = require('!!csv-loader?header=true!../../words.csv') // eslint-disable-line import/no-webpack-loader-syntax

  console.log('truncating words...')

  await db.truncate()

  console.log('rebuilding words...')

  const tasks = words.map(word => db.create({
    en: word.Angol,
    hu: word.Magyar,
    progress: {
      en: 0,
      hu: 0,
    },
  }))

  await Promise.all(tasks)

  console.log('done!')
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

const ModeChooser = ({ onClick }) => {
  const [shuffle, setShuffle] = useState(true)

  const handleClick = mode => () => {
    onClick({ mode, shuffle })
  }

  const toggleShuffle = () => setShuffle(!shuffle)

  return (
    <div className="mode-chooser">
      <h3>Choose mode:</h3>

      <button onClick={handleClick('free')}>free</button>
      <span>|</span>
      <button onClick={handleClick('10')}>10 challenge</button>
      <button onClick={handleClick('25')}>25 challenge</button>
      <button onClick={handleClick('50')}>50 challenge</button>
      <button onClick={toggleShuffle}>suffle {shuffle ? 'on' : 'off'}</button>
    </div>
  )
}

function App() {
  const lang = 'en'
  const [mode, setMode] = useState('home')
  const [words, setWords] = useState()
  const [loading, setLoading] = useState(false)

  const handleWordsRebuildDone = () => {
  }

  const handleModeClick = async ({ mode, shuffle: shuffleOn }) => {
    switch (mode) {
      case 'home':
      default:
        break

      case '10':
      case '25':
      case '50':
        const words = await db.getAll()

        shuffleOn && shuffle(words)

        const wordsSliced = words.slice(0, +mode)

        setWords(wordsSliced)
        break

      case 'free':
        setWords(await db.getAll())
        break
    }

    setMode(mode)
  }

  const handleProgress = know => async id => {
    if (!know) {
      return
    }

    setWords([
      ...words.map(word => word._id === id
        ? {
          ...word,
          progress: {
            ...word.progress,
            [lang]: word.progress[lang] + 1,
          },
        }
        : word
      )
    ])

    if (mode === 'free') {
      const word = await db.get(id)

      word.progress[lang]++

      await db.update(word)

      const words = await db.getAll()

      setWords(words)
    }
  }

  // words && console.log({ wordsLength: words.length })
  // console.log({ progress, words, mode })

  return (
    <div className="App">
      <AppContext.Provider value={{ loading, setLoading }}>
        <header className="App-header">
          {mode !== 'home' && <button onClick={() => handleModeClick(({ mode: 'home' }))}>home</button>}
          <span>wordybirdy</span>
        </header>

        <main>
          {mode === 'home' && <ModeChooser onClick={handleModeClick} />}

          {mode === 'home' && <WordsRebuild onDone={handleWordsRebuildDone} />}

          {mode === 'free' && <FreeMode
            lang={lang}
            words={words}
            onIKnow={handleProgress(true)}
            onIDontKnow={handleProgress(false)}
          />}

          {['10', '25', '50'].includes(mode) && <ChallengeMode
            lang={lang}
            words={words}
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
