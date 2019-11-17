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
    const collection = db.collection('patients')
    const readStream = fs.createReadStream('./data.txt')

    return load(readStream, collection)
  })
  .then(() => {
    
  })
  .catch(err => console.error(err))


