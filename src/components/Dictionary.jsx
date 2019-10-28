import React, { useState, useEffect } from 'react'
import ls from 'local-storage'
import { fetchWord } from '../api'
import { withAppContext } from './App/AppContext'

if (!ls('dictionary')) {
  ls('dictionary', {})
}

const loadDictionary = async ({ en }) => {
  let { [en]: dictionary } = ls('dictionary')

  if (!dictionary || +dictionary.result_code !== 200) {
    try {
      const dictionaries = ['association', 'example']
      const tasks = dictionaries.map(dictionary => fetchWord(en, dictionary))
      const results = await Promise.all(tasks)

      dictionary = results.reduce((dictionary, result) => ({
        ...dictionary,
        ...result,
      }))

      ls('dictionary', {
        ...ls('dictionary'),
        [en]: dictionary,
      })
    } catch (err) {
      console.log('Error loading dictionary:', err)
    }
  }

  return dictionary
}

const Dictionary = ({ word, appContext }) => {
  const [dictionary, setDictionary] = useState()

  useEffect(() => {
    let subscribed = true

    appContext.setLoading(true)

    loadDictionary(word).then(dictionary => {
      appContext.setLoading(false)
      subscribed && setDictionary(dictionary)
    })

    return () => {
      subscribed = false
    }
  }, [word])

  if (!dictionary) {
    return null
  }

  return (
    <div className='dictionary'>
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
    </div>
  )
}

export default withAppContext(Dictionary)
