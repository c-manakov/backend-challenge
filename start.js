const {MongoClient} = require('mongodb')
const {promisify} = require('util')
const {load} = require('./load')
const fs = require('fs')

const url = 'mongodb://localhost:27017'

const dbname = 'backend-challenge'

const client = MongoClient(url)

const connect = promisify(client.connect.bind(client))

connect()
  .then(() => {
    console.log('Successfully connected to a server')
    
    const db = client.db(dbname)
    const readStream = fs.createReadStream('./data.txt')

    load(readStream, db)
  })
  .catch(err => console.error(err))


