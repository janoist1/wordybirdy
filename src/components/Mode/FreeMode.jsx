import React, { useState } from 'react'
import randomInt from '../../utils/randomInt'
import Dictionary from '../Dictionary'

Object.filter = (obj, predicate) => Object.fromEntries(Object.entries(obj).filter(predicate))


const FreeMode = ({ words, progress, onIKnow, onIDontKnow }) => {

  const level = Object.keys(progress).reduce((min, key) => Math.min(min, progress[key]), Number.MAX_SAFE_INTEGER)
  const numbersAvailable = Object.keys(Object.filter(progress, ([_, score]) => score <= level))

  const getNextNumber = () => {
    return numbersAvailable[randomInt(0, numbersAvailable.length - 1)]
  }

  const handleIKnow = () => {
    onIKnow(number)
    handleNext()
  }

  const handleIDontKnow = () => {
    onIDontKnow(number)
    handleNext()
  }

  const handleNext = () => {
    setVisible(false)
    setNumber(getNextNumber())
  }

  const handleShow = async () => {
    setVisible(true)
  }

  const [visible, setVisible] = useState(false)
  const [number, setNumber] = useState(getNextNumber())
  const word = words[number]

  return (
    <div className="main">
      <div className='status'>level: {level}, words left: {numbersAvailable.length}</div>

      <div className='words'>
        <span>{word.Magyar}</span>

        {visible && <>
          -
            <a target="_blank" href={`https://translate.google.com/?source=osdd#auto|auto|${word.Angol}`}>
            {word.Angol}
          </a>
        </>}
      </div>

      <div className='buttons'>
        <button onClick={handleIKnow}>i know</button>
        {visible && <button onClick={handleIDontKnow}>i don't know</button>}
        {!visible && <button onClick={handleShow}>show</button>}
      </div>

      {visible && <Dictionary word={word} />}
    </div>
  )
}

export default FreeMode
