import PouchDB from 'pouchdb'
import uuid from 'short-uuid'

const db = new PouchDB('words')

export default db

export const getAll = () => db
  .allDocs({ include_docs: true, descending: true })
  .then(({ rows }) => rows)
  .then(rows => rows.map(({ doc }) => doc))

export const get = id => db.get(id)

export const create = word => db.put({
  _id: uuid.generate(), //new Date().toISOString(),
  ...word,
})

export const update = word => db.put(word)

export const truncate = async () => {
  const { rows } = await db.allDocs({})

  return Promise.all(rows.map(row =>
    db.remove(row.id, row.value.rev)
  ))
}
