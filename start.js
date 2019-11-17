const {MongoClient} = require('mongodb')
const {promisify} = require('util')
const {load, createEmails} = require('./load')
const fs = require('fs')

const url = 'mongodb://localhost:27017'

const dbname = 'backend-challenge'

const client = MongoClient(url)

const connect = promisify(client.connect.bind(client))

let db

connect()
  .then(() => {
    console.log('Successfully connected to a server')
    
    db = client.db(dbname)
    const readStream = fs.createReadStream('./data.txt')

    return load(readStream, db)
  })
  .then(() => {
    return createEmails(db)
  })
  .catch(err => console.error(err))


