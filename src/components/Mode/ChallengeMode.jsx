import React, { useState, useEffect } from 'react'
import Dictionary from '../Dictionary'

const getIds = words => words.map(({ _id }) => _id)

const ChallengeMode = ({ lang, words, onIKnow, onIDontKnow }) => {
  const [idsLeft, setIdsLeft] = useState([])
  const [pointer, setPointer] = useState(0)
  const [miss, setMiss] = useState(0)
  const [visible, setVisible] = useState(false)

  const handleIKnow = () => {
    const currentId = idsLeft[pointer]

    setPointer(idsLeft.length >= pointer ? 0 : pointer)
    setIdsLeft(idsLeft.filter(id => id !== currentId))
    handleNext()
    onIKnow(currentId)
  }

  const handleIDontKnow = () => {
    setMiss(miss + 1)
    setPointer(pointer + 1 < idsLeft.length ? pointer + 1 : 0)
    handleNext()
    onIDontKnow(idsLeft[pointer])
  }

  const handleNext = () => {
    setVisible(false)
  }

  const handleShow = async () => {
    setVisible(true)
  }

  useEffect(() => {
    if (idsLeft.length > 0) {
      return
    }

    const ids = getIds(words)

    setIdsLeft(ids)
  }, [])

  if (!idsLeft.length) {
    return (
      <div className="main">
        Challenge over!
      </div>
    )
  }

  const word = words.find(({ _id }) => _id === idsLeft[pointer])

  return (
    <div className="main">
      <div className='status'>miss: {miss}, words left: {idsLeft.length}</div>

      <div className='words'>
        <span>{word.hu}</span>

        {visible && <>
          -
            <a target="_blank" href={`https://translate.google.com/?source=osdd#auto|auto|${word.en}`}>
            {word.en}
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

export default ChallengeMode
