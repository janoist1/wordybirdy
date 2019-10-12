import React, { useState, useEffect } from 'react'
import ls from 'local-storage'
import logo from './logo.svg'
import './App.css'
import words from '!!csv-loader?header=true!./words.csv' // eslint-disable-line import/no-webpack-loader-syntax
//&preview=3

Object.filter = (obj, predicate) => Object.fromEntries(Object.entries(obj).filter(predicate))

if (!ls('dictionary')) {
  ls('dictionary', {})
}

const API_URL = 'https://twinword-word-graph-dictionary.p.rapidapi.com'
const API_KEY = '0e8aa254b7msh158b791c303788fp13a822jsn0c9b884e6326'

const fetchWord = (word, dictionary) => fetch(`${API_URL}/${dictionary}/?entry=${word}`, {
  'method': 'GET',
  'headers': {
    'x-rapidapi-host': 'twinword-word-graph-dictionary.p.rapidapi.com',
    'x-rapidapi-key': API_KEY,
  },
})

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min)

const initialProgress = ls('progress') || words.reduce((progress, _, number) => ({ ...progress, [number]: 0 }), {})
//

function App() {
  const [progress, setProgress] = useState(initialProgress)
  const [loading, setLoading] = useState(false)
  const level = Object.keys(progress).reduce((min, key) => Math.min(min, progress[key]), Number.MAX_SAFE_INTEGER)
  const numbersAvailable = Object.keys(Object.filter(progress, ([_, score]) => score <= level))
  const wordsFiltered = words.filter(score => score <= level)

  const getNextNumber = () => {
    return numbersAvailable[randomInt(0, numbersAvailable.length - 1)]
  }

  const loadDictionary = async () => {
    let { [word.Angol]: dictionary } = ls('dictionary')

    if (!dictionary || +dictionary.result_code !== 200) {
      setLoading(true)

      try {
        const dictionaries = ['association', 'example']
        const tasks = dictionaries.map(dictionary => fetchWord(word.Angol, dictionary).then(r => r.json()))
        const results = await Promise.all(tasks)

        dictionary = results.reduce((dictionary, result) => ({
          ...dictionary,
          ...result,
        }))

        ls('dictionary', {
          ...ls('dictionary'),
          [word.Angol]: dictionary,
        })
      } catch (err) {
        console.log('Error loading dictionary:', err)
      }

      setLoading(false)
    }

    setDictionary(dictionary)
  }

  const handleIKnow = () => {
    setProgress({
      ...progress,
      [number]: progress[number] + 1,
    })
    handleNext()
  }

  const handleIDontKnow = () => {
    setProgress({
      ...progress,
      [number]: Math.max(level - 1, progress[number]),
    })
    handleNext()
  }

  const handleNext = () => {
    setDictionary()
    setShow(false)
    setNumber(getNextNumber())
  }

  const handleShow = () => {
    loadDictionary()
    setShow(true)
  }

  const [show, setShow] = useState(false)
  const [dictionary, setDictionary] = useState()
  const [number, setNumber] = useState(getNextNumber())
  const word = words[number]

  useEffect(() => {
    ls('progress', progress)
  })

  return (
    <div className="App">
      <header className="App-header">
      </header>
      <main>
        <div className='status'>level: {level}, words left: {numbersAvailable.length}</div>

        <div className='words'>
          <span>{word.Magyar}</span>

          {show && <>
            -
            <a target="_blank" href={`https://translate.google.com/?source=osdd#auto|auto|${word.Angol}`}>
              {word.Angol}
            </a>
          </>}
        </div>

        <div className='buttons'>
          <button onClick={handleIKnow}>i know</button>
          {show && <button onClick={handleIDontKnow}>i don't know</button>}
          {!show && <button onClick={handleShow}>show</button>}
        </div>

        {loading && <div><h5>Loading...</h5></div>}

        {dictionary && <div className='dictionary'>
          <h6>Associations:</h6>
          <ul>
            {dictionary.assoc_word_ex && dictionary.assoc_word_ex.map((example, i) =>
              <li key={i}>{example}</li>
            )}
          </ul>

          <h6>Examples:</h6>
          <ul>
            {dictionary.example && dictionary.example.map((example, i) =>
              <li key={i}>{example}</li>
            )}
          </ul>
        </div>}
      </main>
    </div>
  )
}

export default App
