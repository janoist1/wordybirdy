const API_URL = 'https://twinword-word-graph-dictionary.p.rapidapi.com'
const API_KEY = '0e8aa254b7msh158b791c303788fp13a822jsn0c9b884e6326'

export const fetchWord = (word, dictionary) => fetch(`${API_URL}/${dictionary}/?entry=${word}`, {
  'method': 'GET',
  'headers': {
    'x-rapidapi-host': 'twinword-word-graph-dictionary.p.rapidapi.com',
    'x-rapidapi-key': API_KEY,
  },
}).then(r => r.json())
