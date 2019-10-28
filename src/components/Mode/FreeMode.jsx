import React, { useState, useEffect } from 'react'
import shuffle from '../../utils/shuffle'
import Dictionary from '../Dictionary'
import Giphy from '../Giphy'

const getIdsShuffeled = words => {
  const ids = words.map(({ _id }) => _id)

  shuffle(ids)

  return ids
}

const calculateLevel = ({ words, lang }) =>
  words.reduce((level, { progress: { [lang]: progress } }) => Math.min(level, progress), Number.MAX_SAFE_INTEGER)

const FreeMode = ({ lang, words, onIKnow, onIDontKnow }) => {
  const [level, setLevel] = useState(calculateLevel({ lang, words }))
  const [idsLeft, setIdsLeft] = useState([])
  const [pointer, setPointer] = useState(0)
  const [visible, setVisible] = useState(false)
  const [dictionary, setDictionary] = useState(false)
  const [giphy, setGiphy] = useState(false)

  const handleIKnow = () => {
    const currentId = idsLeft[pointer]

    setPointer(idsLeft.length >= pointer ? 0 : pointer)
    setIdsLeft(idsLeft.filter(id => id !== currentId))
    handleNext()
    onIKnow(currentId)
  }

  const handleIDontKnow = () => {
    const currentId = idsLeft[pointer]

    setPointer(pointer + 1 < idsLeft.length ? pointer + 1 : 0)
    setIdsLeft([
      ...idsLeft.filter(id => id !== currentId),
      currentId,
    ])
    handleNext()
    onIDontKnow(idsLeft[pointer])
  }

  const handleNext = () => {
    setVisible(false)
    setDictionary(false)
    setGiphy(false)
  }

  const handleShow = () => {
    setVisible(true)
  }

  const handleShowDictionary = () => {
    setDictionary(true)
  }

  const handleShowGiphy = () => {
    setGiphy(true)
  }

  useEffect(() => {
    setLevel(calculateLevel({ lang, words }))
  }, [words])

  useEffect(() => {
    if (idsLeft.length > 0) {
      return
    }

    const ids = getIdsShuffeled(words.filter(({ progress: { [lang]: progress } }) => progress <= level))

    setIdsLeft(ids)
  }, [level])

  if (!idsLeft.length) {
    return null
  }

  const word = words.find(({ _id }) => _id === idsLeft[pointer])

  return (
    <div className="main">
      <div className='status'>level: {level + 1}, words left: {idsLeft.length}</div>

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

      <div className='buttons'>
        <button onClick={handleShowGiphy}>show giphy</button>
        <button onClick={handleShowDictionary}>show dictionary</button>
      </div>

      {giphy && <Giphy word={word} />}

      {dictionary && <Dictionary word={word} />}
    </div>
  )
}

export default FreeMode
