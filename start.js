const {MongoClient} = require('mongodb')
const {promisify} = require('util')
const {load, createEmails} = require('./load')
const fs = require('fs')
const {MONGO_URI, DB_NAME, FILE_PATH} = require('./config.js')
const jest = require('jest')

const client = MongoClient(MONGO_URI)

const connect = promisify(client.connect.bind(client))

let db

connect()
  .then(() => {
    console.log('Successfully connected to a server')
    
    db = client.db(DB_NAME)
    const readStream = fs.createReadStream(FILE_PATH)

    return load(readStream, db)
  })
  .then(() => {
    return createEmails(db)
  })
  .then(() => {
    return jest.runCLI({json: false}, [process.cwd()])
  })
  .catch(err => console.error(err))


