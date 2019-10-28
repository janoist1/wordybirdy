import React, { useState } from 'react'
import { useAsync } from 'react-async-hook'
import { GiphyFetch } from '@giphy/js-fetch-api'
import { Gif } from '@giphy/react-components'
import { withAppContext } from './App/AppContext'

const giphyFetch = new GiphyFetch("sXpGFDGZs0Dv1mmNFvYaGUvYwKX0PWIh")

const Giphy = ({ word, appContext }) => {
  const [gif, setGif] = useState()
  const [gifs, setGifs] = useState()
  const [change, setChange] = useState(false)

  const searchGifs = ({ offset = 0, limit = 10 }) => giphyFetch.search(word.en, { offset, limit }).then(({ data }) => data)

  const handleChangeClick = async () => {
    setChange(true)
    appContext.setLoading(true)
    setGifs(await searchGifs({}))
    appContext.setLoading(false)
  }

  const handleGifClick = data => {
    console.log('gif clicked', data)
  }

  useAsync(async () => {
    appContext.setLoading(true)

    let data
    const id = word.giphyId

    if (id) {
      data = (await giphyFetch.gif(id)).data
    } else {
      data = (await searchGifs({ limit: 1 }))[0]
    }

    appContext.setLoading(false)
    setGif(data)
  }, [])

  return (
    <div className='giphy'>
      {gif && <Gif gif={gif} width={320} />}
      {change
        ? <div className='carousel'>
          {gifs && gifs.map(({ id, images }) => <img key={id} src={images.fixed_height.webp} onClick={() => handleGifClick(id)} />)}
        </div>
        : <button onClick={handleChangeClick}>change</button>
      }
    </div>
  )
}

export default withAppContext(Giphy)
